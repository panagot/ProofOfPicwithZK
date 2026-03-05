import { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { runVerificationFlow } from '../mock/verification'
import { addVerified, createThumbnailDataUrl } from '../store/verifiedPhotos'
import { CameraIcon, ShieldIcon } from '../components/Icons'

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
        <h1>Upload the original photo from your camera</h1>
        <p>ProofPic verifies that a photo comes directly from a real camera. To verify successfully: upload the <strong>original photo from your phone or camera</strong>; do not edit, crop, filter, or re-save the image; do not upload screenshots or photos downloaded from messaging apps.</p>
        <div className="upload-requirement" role="note">
          <strong>Use the original photo</strong> — Upload directly from your camera or phone gallery (the file as saved by your camera). Do not use a photo shared via Facebook, Viber, WhatsApp, or other apps, or one you saved or downloaded from the web. Those copies are often recompressed and stripped of metadata.
        </div>

        <div className="instruction-graphic" role="img" aria-label="Correct and incorrect upload flow">
          <div className="instruction-row instruction-correct">
            <span className="instruction-label">Correct:</span>
            <span>Camera photo → Upload → Verify</span>
          </div>
          <div className="instruction-row instruction-incorrect">
            <span className="instruction-label">Incorrect:</span>
            <span>Photo → Edit → Save → Upload</span>
          </div>
          <div className="instruction-row instruction-incorrect">
            <span className="instruction-label" aria-hidden> </span>
            <span>Photo → WhatsApp / download → Upload</span>
          </div>
          <div className="instruction-row instruction-incorrect">
            <span className="instruction-label" aria-hidden> </span>
            <span>Screenshot → Upload</span>
          </div>
        </div>

        <div className="demo-disclaimer" role="note">
          <strong>Demo limitations</strong> — This demonstration uses simple metadata heuristics to approximate authenticity checks. It does not perform advanced forensic analysis and cannot detect all possible edits. In production, ProofPic would rely on hardware-backed device attestation at capture time.
        </div>

        <div className="demo-limitation-callout" role="note">
          <strong>For reviewers</strong> — In this demo we simulate the full pipeline (image hash → device attestation → ZK proof → zkVerify). We approximate “original capture” using EXIF and metadata: images that appear edited, re-saved, or missing camera metadata are rejected. In production, verification would occur at capture time on the device. <strong>Test:</strong> (1) Original camera photo → Verified. (2) Edited image (e.g. Paint) → Not verified. (3) Screenshot or downloaded image → Not verified.
        </div>

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
        <h2 className="card-title-with-icon"><CameraIcon /> Choose a photo</h2>
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
          <h2 className="card-title-with-icon"><ShieldIcon /> Verified Real Photo</h2>
          <div className="verified-badge" role="status">
            <CheckIcon />
            Verified Real Photo
          </div>
          <p className="success-message">This photo passed our authenticity checks and appears to come directly from a camera capture. Proof submitted to zkVerify.</p>
          <ul className="proof-visualization" aria-label="Verification steps">
            <li><span className="proof-step-done" aria-hidden>✓</span> Image hash generated</li>
            <li><span className="proof-step-done" aria-hidden>✓</span> Device attestation validated</li>
            <li><span className="proof-step-done" aria-hidden>✓</span> Zero-knowledge proof created</li>
            <li><span className="proof-step-done" aria-hidden>✓</span> Proof verified by zkVerify</li>
          </ul>
          <div className="receipt-box">
            <strong>Receipt</strong>
            <br />
            ID: {result.receiptId}
            <br />
            Tx: {result.txHash}
          </div>
          <p className="muted" style={{ marginTop: '1rem' }}>
            Share your verification receipt link to show authenticity.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <NavLink to={`/v/${encodeURIComponent(result.receiptId)}`} className="card-cta">View public receipt</NavLink>
            <NavLink to="/verified" className="card-cta card-cta-secondary">Verified photo feed</NavLink>
            <button type="button" className="card-cta card-cta-secondary" onClick={handleReset}>Verify another photo</button>
            <NavLink to="/" className="card-cta card-cta-secondary">Back to home</NavLink>
          </div>
        </div>
      )}

      {isError && (
        <div className="card failure-card">
          <h2 className="card-title-with-icon"><ShieldIcon /> Not verified</h2>
          <p className="error-msg" role="alert">{error}</p>
          <p className="muted" style={{ marginTop: '0.5rem' }}>Use the original photo from your camera or phone—not an edited or re-saved copy—then try again. Do not upload screenshots or photos downloaded from messaging apps.</p>
          <button type="button" className="card-cta" onClick={handleReset} style={{ marginTop: '1rem' }}>Try another photo</button>
        </div>
      )}
    </div>
  )
}
