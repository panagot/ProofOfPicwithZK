import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { getVerifiedList, clearAllVerified } from '../store/verifiedPhotos'

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function formatDate(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' })
}

export default function VerifiedPictures() {
  const [list, setList] = useState([])
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    setList(getVerifiedList())
  }, [])

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearAllVerified()
    setList([])
    setConfirmClear(false)
  }

  return (
    <div className="container container-wide">
      <div className="page-hero">
        <h1>Verified Photo Feed</h1>
        <p>
          Everything here <strong>passed zkVerify</strong>. No AI, no filters—every photo was verified as captured by a real camera. Each card shows Proof ID, receipt, and a shareable verification link. This list is stored in your browser for this demo; in production it would reflect your account&apos;s verified photos.
        </p>
        <p className="concept-inline">
          Nothing gets on ProofPic without verification. What you see here is real.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="card empty-state-card">
          <div className="empty-state-icon" aria-hidden="true">
            <CheckIcon />
          </div>
          <h2>No verified photos yet</h2>
          <p>Everything on this feed has passed zkVerify—real cameras only. Verify a photo on the <strong>Verify photo</strong> page (use the original from your camera or phone), then it will show up here.</p>
          <NavLink to="/verify" className="card-cta">Verify a photo</NavLink>
        </div>
      ) : (
        <>
          <div className="verified-list-header">
            <p className="muted">{list.length} photo{list.length !== 1 ? 's' : ''} verified</p>
            <button
              type="button"
              className="btn-text btn-text-danger"
              onClick={handleClearAll}
            >
              {confirmClear ? 'Click again to clear all' : 'Clear all (demo)'}
            </button>
          </div>
          <ul className="verified-grid" aria-label="Verified photos">
            {list.map((item) => (
              <li key={item.id} className="verified-card">
                <div className="verified-card-thumb">
                  {item.thumbnailDataUrl ? (
                    <img src={item.thumbnailDataUrl} alt="" />
                  ) : (
                    <div className="verified-card-placeholder">No preview</div>
                  )}
                  <span className="verified-card-badge" aria-label="Verified">
                    <CheckIcon /> Verified
                  </span>
                </div>
                <div className="verified-card-details">
                  <div className="verified-card-meta">
                    <span className="verified-card-date">{formatDate(item.verifiedAt)}</span>
                    {item.fileName && (
                      <span className="verified-card-filename" title={item.fileName}>{item.fileName}</span>
                    )}
                  </div>
                  <dl className="verified-card-receipt">
                    <dt>Proof ID</dt>
                    <dd className="mono">{item.receiptId}</dd>
                    <dt>Tx hash</dt>
                    <dd className="mono">{item.txHash}</dd>
                    <dt>Image hash</dt>
                    <dd className="mono">{item.imageHash}</dd>
                  </dl>
                  <NavLink to={`/v/${encodeURIComponent(item.receiptId)}`} className="verified-card-link">View public receipt</NavLink>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="card reviewer-note-card">
        <h2>For reviewers</h2>
        <p>This feed shows all photos verified in this session (stored in <code>localStorage</code>). Each card includes Proof ID, receipt, and a link to the public verification page. Flow: upload original photo → metadata check → hash → attestation → ZK proof → zkVerify.</p>
      </div>
    </div>
  )
}
