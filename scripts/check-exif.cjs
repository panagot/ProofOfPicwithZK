/**
 * Node script to run the same EXIF checks as the demo on a local file.
 * Usage: node scripts/check-exif.js "C:\path\to\photo.jpg"
 */

const fs = require('fs')
const path = require('path')

const EDITOR_SOFTWARE_PATTERN = /paint|mspaint|microsoft|adobe|photoshop|gimp|canva|snapseed|lightroom|picsart|fotor|photopea|affinity|pixelmator|instagram|whatsapp|telegram|facebook|tiktok|capcut|remini|photoscape|paint\.net|windows\s*photo|photo\s*editor/i
const SCREENSHOT_FILENAME_PATTERN = /screenshot|screen\s*shot|screen_|img_\d{4}-\d{2}-\d{2}-wa/i

const TAG_NAMES = {
  0x010F: 'Make',
  0x0110: 'Model',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x8769: 'ExifIFD',
  0x9003: 'DateTimeOriginal',
}

const RESAVE_THRESHOLD_MS = 2 * 60 * 60 * 1000 // 2 hours

function parseExifDateTime(str) {
  if (!str || str.length < 19) return null
  const normalized = str.replace(/\s+/g, ' ').trim()
  const m = normalized.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/)
  if (!m) return null
  const [, y, mo, d, h, mi, s] = m
  const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s))
  return isNaN(date.getTime()) ? null : date.getTime()
}

function readExifString(buf, tiffStart, valueOff, count, len) {
  const strStart = tiffStart + valueOff
  if (strStart + count > len) return ''
  let str = ''
  for (let s = 0; s < count; s++) {
    const c = buf[strStart + s]
    if (c === 0) break
    str += String.fromCharCode(c)
  }
  return str.trim()
}

function checkFile(filePath) {
  const fileName = path.basename(filePath)
  const ext = path.extname(filePath).toLowerCase()
  console.log('File:', filePath)
  console.log('Name:', fileName)
  console.log('Ext:', ext)
  console.log('')

  if (ext === '.png') {
    console.log('Result: WOULD REJECT (unsupported_format - PNG)')
    return
  }

  if (SCREENSHOT_FILENAME_PATTERN.test(fileName.toLowerCase())) {
    console.log('Result: WOULD REJECT (screenshot filename)')
    return
  }

  if (ext !== '.jpg' && ext !== '.jpeg') {
    console.log('Result: WOULD PASS (non-JPEG, demo only enforces JPEG)')
    return
  }

  const buf = fs.readFileSync(filePath)
  const len = Math.min(buf.length, 64 * 1024)
  const u8 = new Uint8Array(buf.buffer, buf.byteOffset, len)

  let foundExif = false
  let hasSoftware = false
  let softwareValue = ''
  let hasMakeOrModel = false
  let makeValue = ''
  let modelValue = ''
  let softwareIsEditor = false
  let exifDateTime = null
  let wouldFailResaved = false
  const allTags = []

  let i = 0
  while (i < len - 2) {
    if (u8[i] === 0xff && u8[i + 1] === 0xe1) {
      const segLen = (u8[i + 2] << 8) | u8[i + 3]
      const dataStart = i + 4
      if (dataStart + 6 > len) break
      if (u8[dataStart] === 0x45 && u8[dataStart + 1] === 0x78 && u8[dataStart + 2] === 0x69 && u8[dataStart + 3] === 0x66 && u8[dataStart + 4] === 0 && u8[dataStart + 5] === 0) {
        foundExif = true
        const tiffStart = dataStart + 6
        if (tiffStart + 8 > len) {
          console.log('EXIF block too small')
          break
        }
        const little = u8[tiffStart] === 0x49 && u8[tiffStart + 1] === 0x49
        const getU16 = (o) => little ? u8[o] | (u8[o + 1] << 8) : (u8[o] << 8) | u8[o + 1]
        const getU32 = (o) => little ? (u8[o] | (u8[o + 1] << 8) | (u8[o + 2] << 16) | (u8[o + 3] << 24)) >>> 0 : ((u8[o] << 24) | (u8[o + 1] << 16) | (u8[o + 2] << 8) | u8[o + 3]) >>> 0
        const ifd0Off = getU32(tiffStart + 4)
        const ifd0 = tiffStart + ifd0Off
        if (ifd0 + 2 > len) break
        const numTags = getU16(ifd0)
        console.log('EXIF found. IFD0 at offset', ifd0Off, 'with', numTags, 'tags\n')

        for (let t = 0; t < numTags && ifd0 + 2 + (t + 1) * 12 <= len; t++) {
          const tagOff = ifd0 + 2 + t * 12
          const tagId = getU16(tagOff)
          const type = getU16(tagOff + 2)
          const count = getU32(tagOff + 4)
          const valueOff = getU32(tagOff + 8)
          const name = TAG_NAMES[tagId] || ('Tag_0x' + tagId.toString(16))
          if (type === 2 && count > 0 && count < 256) {
            const str = readExifString(u8, tiffStart, valueOff, count, len)
            allTags.push({ name, tagId: '0x' + tagId.toString(16), value: str })
            if (tagId === 0x0131) {
              hasSoftware = true
              softwareValue = str
              softwareIsEditor = EDITOR_SOFTWARE_PATTERN.test(str)
            } else if (tagId === 0x010F || tagId === 0x0110) {
              if (str.length > 0) hasMakeOrModel = true
              if (tagId === 0x010F) makeValue = str
              if (tagId === 0x0110) modelValue = str
            } else if (tagId === 0x0132) {
              exifDateTime = parseExifDateTime(str)
            }
          }
        }
        break
      }
      i = dataStart + segLen - 2
      continue
    }
    i++
  }

  console.log('Relevant EXIF tags (IFD0, type ASCII):')
  allTags.forEach(({ name, tagId, value }) => console.log('  ', name, tagId, '=', JSON.stringify(value)))
  console.log('')
  console.log('Checks:')
  console.log('  foundExif:', foundExif)
  console.log('  hasSoftware:', hasSoftware, softwareValue ? '→ ' + JSON.stringify(softwareValue) : '')
  console.log('  softwareIsEditor:', softwareIsEditor)
  const fileMtimeMs = fs.statSync(filePath).mtimeMs
  wouldFailResaved = foundExif && exifDateTime != null && fileMtimeMs > exifDateTime + RESAVE_THRESHOLD_MS
  console.log('  exifDateTime:', exifDateTime != null ? new Date(exifDateTime).toISOString() : 'none')
  console.log('  file lastModified (mtime):', new Date(fileMtimeMs).toISOString())
  console.log('  wouldFailResaved (file saved >2h after EXIF date):', wouldFailResaved)
  console.log('')

  if (!foundExif) {
    console.log('Result: WOULD REJECT (no_exif - no EXIF block found)')
    return
  }
  if (softwareIsEditor) {
    console.log('Result: WOULD REJECT (edited - Software matches editor list)')
    return
  }
  if (!hasSoftware) {
    console.log('Result: WOULD REJECT (no_software - no Software tag)')
    return
  }
  if (!hasMakeOrModel) {
    console.log('Result: WOULD REJECT (no_camera_fields - no Make or Model)')
    return
  }
  if (wouldFailResaved) {
    console.log('Result: WOULD REJECT (resaved - file save time is much later than EXIF capture time)')
    return
  }
  console.log('Result: WOULD PASS (all checks passed)')
}

const filePath = process.argv[2] || 'C:\\Users\\panag\\OneDrive\\Desktop\\2025backup\\For cleanbackup 2025\\sarabala\\Αγίου Ανδρέα 2.jpg.jpg'
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath)
  process.exit(1)
}
checkFile(filePath)
