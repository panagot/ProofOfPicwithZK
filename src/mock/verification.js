/**
 * ProofPic PoC: simulated photo verification flow.
 * In production: real image hash, device attestation (Play Integrity / App Attest), ZK proof, zkVerify submission.
 *
 * Demo edit detection: we reject images that appear edited or re-saved (EXIF Software tag from an editor,
 * or missing EXIF typical of emailed/re-saved files) so reviewers see the intended "edited = not verified" behavior.
 */

// Deny list: EXIF Software tag (ChatGPT/Grok guidelines)
const EDITOR_SOFTWARE_PATTERN = /paint|mspaint|microsoft|adobe|photoshop|gimp|canva|snapseed|lightroom|picsart|fotor|photopea|affinity|pixelmator|instagram|whatsapp|telegram|facebook|tiktok|capcut|remini|photoscape|paint\.net|windows\s*photo|photo\s*editor/i

// Screenshot-like filenames (Rule 5)
const SCREENSHOT_FILENAME_PATTERN = /screenshot|screen\s*shot|screen_|img_\d{4}-\d{2}-\d{2}-wa/i

/** Read ASCII string from EXIF at tiffStart + valueOff, max count bytes. */
function readExifString(u8, tiffStart, valueOff, count, len) {
  const strStart = tiffStart + valueOff
  if (strStart + count > len) return ''
  let str = ''
  for (let s = 0; s < count; s++) {
    const c = u8[strStart + s]
    if (c === 0) break
    str += String.fromCharCode(c)
  }
  return str.trim()
}

/** Parse EXIF DateTime string "YYYY:MM:DD HH:MM:SS" to timestamp, or null. */
function parseExifDateTime(str) {
  if (!str || str.length < 19) return null
  const normalized = str.replace(/\s+/g, ' ').trim()
  const m = normalized.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/)
  if (!m) return null
  const [, y, mo, d, h, mi, s] = m
  const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s))
  return isNaN(date.getTime()) ? null : date.getTime()
}

/**
 * Demo-only: check if image looks edited or re-saved (ChatGPT/Grok guidelines).
 * Rules: no EXIF → reject; EXIF Software = editor → reject; no Software → reject;
 * no Make/Model → reject; PNG → reject; screenshot filename → reject.
 */
export async function demoEditCheck(file) {
  if (!file || !file.type.startsWith('image/')) return { pass: true }

  // Rule 6: Reject PNG (usually screenshot or export)
  if (file.type === 'image/png') {
    return { pass: false, reasonKey: 'unsupported_format' }
  }

  // Only enforce EXIF/screenshot rules for JPEG
  if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') return { pass: true }

  // Rule 5: Screenshot filename heuristic
  const name = (file.name || '').toLowerCase()
  if (SCREENSHOT_FILENAME_PATTERN.test(name)) {
    return { pass: false, reasonKey: 'screenshot' }
  }

  const buf = await file.slice(0, 64 * 1024).arrayBuffer()
  const u8 = new Uint8Array(buf)
  const len = u8.length

  // Find JPEG APP1 (0xFF 0xE1)
  let i = 0
  while (i < len - 2) {
    if (u8[i] === 0xff && u8[i + 1] === 0xe1) {
      const segLen = (u8[i + 2] << 8) | u8[i + 3]
      const dataStart = i + 4
      if (dataStart + 6 > len) break
      if (u8[dataStart] === 0x45 && u8[dataStart + 1] === 0x78 && u8[dataStart + 2] === 0x69 && u8[dataStart + 3] === 0x66 && u8[dataStart + 4] === 0 && u8[dataStart + 5] === 0) {
        const tiffStart = dataStart + 6
        if (tiffStart + 8 > len) return { pass: false, reasonKey: 'no_exif' }
        const little = u8[tiffStart] === 0x49 && u8[tiffStart + 1] === 0x49
        const getU16 = (o) => little ? u8[o] | (u8[o + 1] << 8) : (u8[o] << 8) | u8[o + 1]
        const getU32 = (o) => little ? (u8[o] | (u8[o + 1] << 8) | (u8[o + 2] << 16) | (u8[o + 3] << 24)) >>> 0 : ((u8[o] << 24) | (u8[o + 1] << 16) | (u8[o + 2] << 8) | u8[o + 3]) >>> 0
        const ifd0Off = getU32(tiffStart + 4)
        const ifd0 = tiffStart + ifd0Off
        if (ifd0 + 2 > len) return { pass: false, reasonKey: 'no_exif' }
        const numTags = getU16(ifd0)
        let hasSoftware = false
        let softwareIsEditor = false
        let hasMakeOrModel = false
        let exifDateTime = null // EXIF DateTime (0x0132) or DateTimeOriginal from camera
        for (let t = 0; t < numTags && ifd0 + 2 + (t + 1) * 12 <= len; t++) {
          const tagOff = ifd0 + 2 + t * 12
          const tagId = getU16(tagOff)
          const type = getU16(tagOff + 2)
          const count = getU32(tagOff + 4)
          const valueOff = getU32(tagOff + 8)
          if (type === 2 && count > 0 && count < 256) {
            const str = readExifString(u8, tiffStart, valueOff, count, len)
            if (tagId === 0x0131) {
              hasSoftware = true
              if (EDITOR_SOFTWARE_PATTERN.test(str)) softwareIsEditor = true
            } else if (tagId === 0x010F || tagId === 0x0110) {
              if (str.length > 0) hasMakeOrModel = true
            } else if (tagId === 0x0132) {
              exifDateTime = parseExifDateTime(str)
            }
          }
        }
        if (softwareIsEditor) return { pass: false, reasonKey: 'edited' }
        // Do not require Software tag — many genuine camera photos omit it (ChatGPT/Grok feedback). Only reject when Software is present and matches an editor.
        if (!hasMakeOrModel) return { pass: false, reasonKey: 'no_camera_fields' }
        // Re-save heuristic: file lastModified much later than EXIF DateTime suggests re-save (e.g. edited in Paint). 24h window to avoid false rejections when camera syncs files later (feedback).
        const RESAVE_THRESHOLD_MS = 24 * 60 * 60 * 1000 // 24 hours
        if (exifDateTime != null && file.lastModified != null) {
          const fileTime = file.lastModified
          if (fileTime > exifDateTime + RESAVE_THRESHOLD_MS) {
            return { pass: false, reasonKey: 'resaved' }
          }
        }
        return { pass: true }
      }
      i = dataStart + segLen - 2
      continue
    }
    i++
  }

  return { pass: false, reasonKey: 'no_exif' }
}

/** User-facing failure messages (ChatGPT guidelines). */
export const FAILURE_MESSAGES = {
  no_exif: 'This photo does not contain camera metadata (EXIF). Please upload the original photo directly from your camera or phone, not a screenshot or downloaded copy.',
  edited: 'This photo appears to have been edited. The image metadata shows it was processed by an editing application. Please upload the original photo directly from your camera before any edits or filters.',
  no_software: 'No camera software tag in EXIF. The file may have been re-saved or edited. Please upload the original photo from your camera or phone.',
  no_camera_fields: 'This photo does not contain camera identifiers (Make/Model). Please upload the original camera photo file.',
  screenshot: 'This file looks like a screenshot. Screenshots cannot be verified as camera captures. Please upload the original photo taken by your camera.',
  unsupported_format: 'PNG files are usually screenshots or exported images. Please upload the original JPEG from your camera.',
  resaved: 'This file appears to have been re-saved or modified after it was taken (e.g. edited in another app). The save time is much later than the capture time in the photo metadata. Please upload the original photo directly from your camera.',
}

/** Simulate computing image hash from file. Returns a mock hash. */
export function computeImageHash(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      // In production: actual hash (e.g. SHA-256 of pixel data or file bytes)
      const mockHash = 'H_' + btoa(String(file.size + file.lastModified)).slice(0, 24).replace(/[+/=]/g, '')
      setTimeout(() => resolve(mockHash), 400)
    }
    reader.readAsArrayBuffer(file.slice(0, 1024))
  })
}

/** Simulate device attestation: "Device certifies H was captured at T by genuine hardware." */
export function simulateAttestation(imageHash) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        attested: true,
        timestamp: Date.now(),
        deviceId: 'device_' + Math.random().toString(36).slice(2, 10),
      })
    }, 500)
  })
}

/** Simulate generating ZK proof (Groth16). */
export function simulateProofGeneration(imageHash, attestation) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        proofPayload: 'zk_proof_' + Date.now(),
        publicInputs: [imageHash],
        receiptId: null, // set after zkVerify
      })
    }, 600)
  })
}

/** Simulate submitting proof to zkVerify and getting receipt. */
export function simulateZkVerifySubmit(proof) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const receiptId = 'zkVerify_receipt_' + Date.now()
      resolve({
        valid: true,
        receiptId,
        txHash: '0x' + Math.random().toString(16).slice(2, 18),
      })
    }, 800)
  })
}

/**
 * Full flow: demo edit check → hash → attestation → proof → zkVerify.
 * Yields step names for UI progress. For reviewers: edited or re-saved images (e.g. Paint, no EXIF) fail the check.
 */
export async function runVerificationFlow(file, onStep) {
  onStep?.('hash')
  const editCheck = await demoEditCheck(file)
  if (!editCheck.pass) {
    const msg = editCheck.reasonKey
      ? (FAILURE_MESSAGES[editCheck.reasonKey] || editCheck.reason)
      : (editCheck.reason || 'This image cannot be verified. Use the original photo from your camera.')
    throw new Error(msg)
  }
  const imageHash = await computeImageHash(file)
  onStep?.('attestation')
  const attestation = await simulateAttestation(imageHash)
  onStep?.('proof')
  const proof = await simulateProofGeneration(imageHash, attestation)
  onStep?.('zkverify')
  const result = await simulateZkVerifySubmit(proof)
  return {
    imageHash,
    attestation,
    proof,
    receiptId: result.receiptId,
    txHash: result.txHash,
    verifiedAt: Date.now(),
  }
}
