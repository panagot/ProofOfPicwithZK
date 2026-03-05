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

const DEMO_RECEIPT = {
  receiptId: 'zkVerify_receipt_demo_12345',
  txHash: '0x1a2b3c4d5e6f7890',
  imageHash: 'H_ZXhhbXBsZV9oYXNo',
  verifiedAt: Date.now() - 86400000,
}

export default function VerificationReceipt() {
  const { receiptId } = useParams()
  const isDemo = receiptId === 'demo'
  const entry = isDemo ? DEMO_RECEIPT : (receiptId ? getVerifiedByReceiptId(receiptId) : null)

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

          {entry?.imageHash && (
            <>
              <dt>Photo hash</dt>
              <dd className="mono">{entry.imageHash}</dd>
            </>
          )}

          {entry?.txHash && (
            <>
              <dt>Transaction</dt>
              <dd className="mono">{entry.txHash}</dd>
            </>
          )}
        </dl>

        {entry?.thumbnailDataUrl && !isDemo && (
          <div className="receipt-page-thumb">
            <img src={entry.thumbnailDataUrl} alt="" />
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
