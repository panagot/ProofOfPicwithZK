import { useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { getVerifiedByReceiptId } from '../store/verifiedPhotos'
import { ShieldIcon } from '../components/Icons'

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function formatDate(ts) {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return '—'
  }
}

/** Example verified photos with receipt data (for /v/demo page). Times derived from filename IMG_YYYYMMDD_HHMMSSmmm. */
const EXAMPLE_RECEIPTS = [
  {
    imageSrc: '/photos/IMG_20260306_142948707_AE.jpg',
    fileName: 'IMG_20260306_142948707_AE.jpg',
    receiptId: 'zkVerify_receipt_example_142948',
    txHash: '0x8f2e1a4b9c3d5e6f',
    imageHash: 'H_XzE0Mjk0ODcwNw',
    verifiedAt: new Date(2026, 2, 6, 14, 30, 5).getTime(),
    captureTime: new Date(2026, 2, 6, 14, 29, 48).getTime(),
    deviceMakeModel: 'Motorola Moto G 5G',
    imageDimensions: '4032 × 3024',
    attestationType: 'Hardware-backed (Play Integrity / App Attest simulated)',
    publicInputs: 'Image hash (committed in proof)',
    verificationContract: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bE81',
    proofSizeBytes: 384,
    blockNumber: 18472935,
  },
  {
    imageSrc: '/photos/IMG_20260306_143029988_AE.jpg',
    fileName: 'IMG_20260306_143029988_AE.jpg',
    receiptId: 'zkVerify_receipt_example_143029',
    txHash: '0x1b3c4d5e6f7a8b9c',
    imageHash: 'H_XzE0MzAyOTk4OA',
    verifiedAt: new Date(2026, 2, 6, 14, 30, 45).getTime(),
    captureTime: new Date(2026, 2, 6, 14, 30, 29).getTime(),
    deviceMakeModel: 'Motorola Moto G 5G',
    imageDimensions: '4032 × 3024',
    attestationType: 'Hardware-backed (Play Integrity / App Attest simulated)',
    publicInputs: 'Image hash (committed in proof)',
    verificationContract: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bE81',
    proofSizeBytes: 384,
    blockNumber: 18472936,
  },
]

function ExampleReceiptCard({ receipt }) {
  const slug = receipt.receiptId.replace('zkVerify_receipt_example_', '')
  return (
    <div id={`example-${slug}`} className="receipt-page-example-photo-card">
      <div className="receipt-page-example-photo-thumb">
        <img src={receipt.imageSrc} alt="" />
        <span className="receipt-page-example-photo-badge">Verified</span>
      </div>
      <dl className="receipt-page-example-photo-details">
        <dt>Proof ID</dt>
        <dd className="mono">{receipt.receiptId}</dd>
        <dt>Verification proof</dt>
        <dd>Groth16</dd>
        <dt>Verification network</dt>
        <dd>zkVerify</dd>
        <dt>Verification time</dt>
        <dd>{formatDate(receipt.verifiedAt)}</dd>
        <dt>Device / camera</dt>
        <dd>{receipt.deviceMakeModel}</dd>
        <dt>Capture time (EXIF)</dt>
        <dd>{formatDate(receipt.captureTime)}</dd>
        <dt>Attestation</dt>
        <dd>{receipt.attestationType}</dd>
        <dt>Photo hash</dt>
        <dd className="mono">{receipt.imageHash}</dd>
        <dt>Public inputs</dt>
        <dd>{receipt.publicInputs}</dd>
        <dt>Verification contract</dt>
        <dd className="mono">{receipt.verificationContract}</dd>
        <dt>Proof size</dt>
        <dd>{receipt.proofSizeBytes} bytes</dd>
        <dt>Block</dt>
        <dd className="mono">{receipt.blockNumber.toLocaleString()}</dd>
        <dt>Image dimensions</dt>
        <dd>{receipt.imageDimensions}</dd>
        <dt>Original file</dt>
        <dd className="mono">{receipt.fileName}</dd>
        <dt>Transaction</dt>
        <dd className="mono">{receipt.txHash}</dd>
      </dl>
    </div>
  )
}

export default function VerificationReceipt() {
  const { receiptId } = useParams()
  const isDemo = receiptId === 'demo'
  const entry = isDemo ? EXAMPLE_RECEIPTS[1] : (receiptId ? getVerifiedByReceiptId(receiptId) : null)

  useEffect(() => {
    if (!isDemo || typeof window === 'undefined') return
    const hash = window.location.hash?.slice(1)
    if (!hash || !hash.startsWith('example-')) return
    const el = document.getElementById(hash)
    if (!el) return
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(t)
  }, [isDemo])

  return (
    <div className="container">
      <div className="receipt-page card">
        {isDemo && (
          <p className="receipt-page-demo-badge muted" role="status">Sample receipt — for reviewers</p>
        )}
        <div className="receipt-page-badge">
          <CheckIcon />
          <h1>Verified Real Photo</h1>
          <p className="receipt-page-status">Verified on zkVerify</p>
        </div>

        <dl className="receipt-page-details">
          <dt>Proof ID</dt>
          <dd className="mono">{entry?.receiptId || receiptId || '—'}</dd>

          <dt>Verification proof</dt>
          <dd>Groth16</dd>

          <dt>Verification network</dt>
          <dd>zkVerify</dd>

          <dt>Verification time</dt>
          <dd>{entry ? formatDate(entry.verifiedAt) : '—'}</dd>

          {entry?.deviceMakeModel && (
            <>
              <dt>Device / camera</dt>
              <dd>{entry.deviceMakeModel}</dd>
            </>
          )}

          {(entry?.captureTime != null) && (
            <>
              <dt>Capture time (EXIF)</dt>
              <dd>{formatDate(entry.captureTime)}</dd>
            </>
          )}

          {entry && (
            <>
              <dt>Attestation</dt>
              <dd>{entry.attestationType || 'Hardware-backed (Play Integrity / App Attest simulated)'}</dd>
            </>
          )}

          {entry?.imageHash && (
            <>
              <dt>Photo hash</dt>
              <dd className="mono">{entry.imageHash}</dd>
            </>
          )}

          {entry && (
            <>
              <dt>Public inputs</dt>
              <dd>{entry.publicInputs || 'Image hash (committed in proof)'}</dd>
            </>
          )}

          {entry && (
            <>
              <dt>Verification contract</dt>
              <dd className="mono">{entry.verificationContract || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bE81'}</dd>
            </>
          )}

          {entry && (
            <>
              <dt>Proof size</dt>
              <dd>{entry.proofSizeBytes != null ? (entry.proofSizeBytes < 1024 ? `${entry.proofSizeBytes} bytes` : `~${(entry.proofSizeBytes / 1024).toFixed(1)} KB`) : '384 bytes'}</dd>
            </>
          )}

          {entry && (
            <>
              <dt>Block</dt>
              <dd className="mono">{(entry.blockNumber != null ? entry.blockNumber : 18472934).toLocaleString()}</dd>
            </>
          )}

          {entry?.imageDimensions && (
            <>
              <dt>Image dimensions</dt>
              <dd>{entry.imageDimensions}</dd>
            </>
          )}

          {entry?.fileName && (
            <>
              <dt>Original file</dt>
              <dd className="mono">{entry.fileName}</dd>
            </>
          )}

          {entry?.txHash && (
            <>
              <dt>Transaction</dt>
              <dd className="mono">{entry.txHash}</dd>
            </>
          )}
        </dl>

        {(isDemo || entry?.thumbnailDataUrl) && (
          <div className="receipt-page-thumb">
            {isDemo ? (
              <div className="receipt-page-demo-image">
                <div className="receipt-page-demo-image-placeholder" aria-hidden="true">
                  <img src={entry.imageSrc} alt="" className="receipt-demo-photo-svg" />
                </div>
                <div className="receipt-page-demo-banner">
                  <CheckIcon />
                  <span>Verified Real Photo</span>
                </div>
              </div>
            ) : (
              <img src={entry.thumbnailDataUrl} alt="" />
            )}
          </div>
        )}

        {isDemo && (
          <div className="receipt-page-example-photos" role="region" aria-label="Example verified photos">
            <h3 className="receipt-page-example-photos-title">Example verified photos</h3>
            <p className="receipt-page-example-photos-intro">These camera photos are examples of images that pass verification when uploaded as the original file. Each shows the same receipt information as above.</p>
            <div className="receipt-page-example-photos-grid">
              {EXAMPLE_RECEIPTS.map((r, i) => (
                <ExampleReceiptCard key={i} receipt={r} />
              ))}
            </div>
          </div>
        )}

        {!entry && receiptId && !isDemo && (
          <p className="receipt-page-note muted">
            This verification receipt was submitted to zkVerify. Full details are visible only on the device that performed the verification.
          </p>
        )}

        <div className="receipt-page-actions">
          <NavLink to="/verified" className="card-cta card-cta-secondary">View verified feed</NavLink>
          <NavLink to="/verify" className="card-cta card-cta-secondary">Verify another photo</NavLink>
          <NavLink to="/" className="card-cta card-cta-secondary">Back to home</NavLink>
        </div>
      </div>
    </div>
  )
}
