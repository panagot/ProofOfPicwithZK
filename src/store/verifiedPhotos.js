/**
 * Persist verified photos in localStorage for the "Verified pictures" page.
 * In production this would be server-backed; for PoC we keep it client-side.
 */

const STORAGE_KEY = 'proofpic_verified_photos'
/** Thumbnail longest edge (px). Large enough for feed cards (~280px+) so images stay sharp when displayed. */
const MAX_THUMBNAIL_SIZE = 400

export function getVerifiedList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

/**
 * @param {object} entry
 * @param {string} entry.receiptId
 * @param {string} entry.txHash
 * @param {number} entry.verifiedAt
 * @param {string} entry.imageHash
 * @param {string} [entry.thumbnailDataUrl]
 * @param {string} [entry.fileName]
 */
export function addVerified(entry) {
  const list = getVerifiedList()
  const id = 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
  list.unshift({ id, ...entry })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return id
}

export function removeVerified(id) {
  const list = getVerifiedList().filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/** Get a single verified entry by receiptId (for public receipt page). */
export function getVerifiedByReceiptId(receiptId) {
  const list = getVerifiedList()
  return list.find((item) => item.receiptId === receiptId) || null
}

export function clearAllVerified() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Create a small thumbnail data URL from a File (image).
 * @param {File} file
 * @param {number} maxSize
 * @returns {Promise<{ dataUrl: string|null, width: number, height: number }|null>}
 */
export function createThumbnailDataUrl(file, maxSize = MAX_THUMBNAIL_SIZE) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const origW = img.naturalWidth || img.width
      const origH = img.naturalHeight || img.height
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width
        width = maxSize
      } else if (height > maxSize) {
        width = (width * maxSize) / height
        height = maxSize
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      try {
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.7), width: origW, height: origH })
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}
