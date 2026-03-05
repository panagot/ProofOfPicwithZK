import { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { runVerificationFlow } from '../mock/verification'
import { addVerified, createThumbnailDataUrl } from '../store/verifiedPhotos'

const STEPS = [
  { id: 'upload', label: 'Upload or take photo' },
  { id: 'hash', label: 'Compute image hash' },
  { id: 'attestation', label: 'Device attestation' },
  { id: 'proof', label: 'Generate ZK proof' },
  { id: 'zkverify', label: 'Submit to zkVerify' },
  { id: 'done', label: 'Verified Real Photo' },
]

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function ForReviewersVerify() {
  const [open, setOpen] = useState(false)
  return (
    <div className="reviewer-section">
      <button
        type="button"
        className="reviewer-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        For reviewers: how to test this flow
      </button>
      {open && (
        <div className="reviewer-content">
          <ul>
            <li>Use a photo <strong>from your device gallery or camera</strong> (original file). Do not use a screenshot or a photo saved from WhatsApp/Viber/Facebook.</li>
            <li>Click &quot;Verify this photo&quot; and watch the steps: hash → attestation → proof → zkVerify (simulated).</li>
            <li>After success, open <strong>Verified pictures</strong> in the nav to see the entry with receipt ID and tx hash.</li>
            <li>In production: real device attestation (Play Integrity / App Attest), Groth16 proof, and on-chain zkVerify submission.</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default function VerifyPhoto() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [step, setStep] = useState('upload') // upload | hash | attestation | proof | zkverify | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setStep('upload')
    setResult(null)
    setError('')
  }

  const handleVerify = async () => {
    if (!file) return
    setError('')
    setVerifying(true)
    setStep('hash')
    try {
      const res = await runVerificationFlow(file, (s) => setStep(s))
      setResult(res)
      setStep('done')
      const thumbnailDataUrl = await createThumbnailDataUrl(file)
      addVerified({
        receiptId: res.receiptId,
        txHash: res.txHash,
        verifiedAt: res.verifiedAt,
        imageHash: res.imageHash,
        thumbnailDataUrl: thumbnailDataUrl || undefined,
        fileName: file.name || undefined,
      })
    } catch (err) {
      setError(err.message || 'Verification failed.')
      setStep('error')
    } finally {
      setVerifying(false)
    }
  }

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setStep('upload')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const currentStepIndex = STEPS.findIndex((s) => s.id === step)
  const isDone = step === 'done'
  const isError = step === 'error'

  return (
    <div className="container">
      <div className="page-hero">
        <h1>Verify a photo</h1>
        <p>Nothing gets on ProofPic without passing this step. Upload or take a photo—we prove it was captured by a <strong>real camera</strong>, then verify it on zkVerify. If it passes, you get the badge. If it doesn&apos;t, it doesn&apos;t get in. Real only.</p>
        <div className="upload-requirement" role="note">
          <strong>Use the original photo</strong> — Upload directly from your camera or phone gallery (the file as saved by your camera). Do not use a photo that was shared via Facebook, Viber, WhatsApp, or other apps, or one you saved/downloaded from the web. Those copies are often recompressed and stripped of metadata, so we cannot verify them.
        </div>
        <p className="muted">Demo: hash, attestation, and proof are simulated. Production uses real device attestation (Play Integrity / App Attest) and Groth16 proofs.</p>

        <div className="info-blocks">
          <div className="info-block">
            <h3>What we verify</h3>
            <p>That the image was captured by <strong>genuine device hardware</strong> (not a screenshot, edited file, or AI-generated image). We compute a hash, bind it to your device attestation, and produce a ZK proof verified on zkVerify. We do not identify you—only that this photo came from a real camera.</p>
          </div>
          <div className="info-block">
            <h3>Your privacy</h3>
            <p>We do not store your photo. We use the file to compute a hash and run verification; the proof and receipt are what get sent to zkVerify. No raw image or personal data is stored on our servers. The verified list in your browser is local only (this demo).</p>
          </div>
        </div>

        <ForReviewersVerify />
      </div>

      <div className="card">
        <h2>Choose a photo</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          disabled={verifying}
          aria-label="Select or capture a photo"
        />
        {previewUrl && (
          <>
            <img src={previewUrl} alt="Preview" className="photo-preview" />
            <div className="step-indicator" aria-label="Verification steps">
              {STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={`step-dot ${i < currentStepIndex || (step === s.id && step !== 'done') ? 'done' : ''} ${step === s.id && step !== 'done' ? 'active' : ''} ${step === 'done' && s.id === 'done' ? 'done' : ''}`}
                  aria-current={step === s.id ? 'step' : undefined}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <div className="flow-step done">Upload or take photo</div>
            <div className={`flow-step ${['hash', 'attestation', 'proof', 'zkverify', 'done'].includes(step) ? 'done' : ''} ${step === 'hash' ? 'active' : ''}`}>Compute image hash</div>
            <div className={`flow-step ${['attestation', 'proof', 'zkverify', 'done'].includes(step) ? 'done' : ''} ${step === 'attestation' ? 'active' : ''}`}>Device attestation (genuine hardware)</div>
            <div className={`flow-step ${['proof', 'zkverify', 'done'].includes(step) ? 'done' : ''} ${step === 'proof' ? 'active' : ''}`}>Generate ZK proof</div>
            <div className={`flow-step ${['zkverify', 'done'].includes(step) ? 'done' : ''} ${step === 'zkverify' ? 'active' : ''}`}>Submit to zkVerify</div>
            <div className={`flow-step ${step === 'done' ? 'done' : ''} ${step === 'done' ? 'active' : ''}`}>Verified Real Photo</div>
            {!isDone && !isError && (
              <button
                type="button"
                className="card-cta"
                onClick={handleVerify}
                disabled={verifying}
              >
                {verifying ? 'Verifying…' : 'Verify this photo'}
              </button>
            )}
          </>
        )}
        {error && <p className="error-msg" role="alert">{error}</p>}
      </div>

      {isDone && result && (
        <div className="card success-card">
          <h2>Verified Real Photo</h2>
          <div className="verified-badge" role="status">
            <CheckIcon />
            Verified Real Photo
          </div>
          <p className="success-message">This photo was verified as captured by genuine hardware. Proof submitted to zkVerify.</p>
          <div className="receipt-box">
            <strong>Receipt</strong>
            <br />
            ID: {result.receiptId}
            <br />
            Tx: {result.txHash}
          </div>
          <p className="muted" style={{ marginTop: '1rem' }}>
            Share your badge to show authenticity. In production, the receipt links to on-chain verification.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <NavLink to="/verified" className="card-cta">View verified pictures</NavLink>
            <button type="button" className="card-cta card-cta-secondary" onClick={handleReset}>Verify another photo</button>
            <NavLink to="/" className="card-cta card-cta-secondary">Back to home</NavLink>
          </div>
        </div>
      )}

      {isError && (
        <div className="card">
          <p className="error-msg">{error}</p>
          <button type="button" className="card-cta" onClick={handleReset}>Try again</button>
        </div>
      )}
    </div>
  )
}
