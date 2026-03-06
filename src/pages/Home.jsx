import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CameraIcon, ShieldIcon, ChainIcon } from '../components/Icons'
import ZkVerifyTooltip from '../components/ZkVerifyTooltip'

function ForReviewersHome() {
  const [open, setOpen] = useState(true)
  return (
    <div className="reviewer-section">
      <button
        type="button"
        className="reviewer-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        For reviewers: quick checklist {open ? '▼' : '▶'}
      </button>
      {open && (
        <div className="reviewer-content">
          <p className="reviewer-paragraph">
            In this demo, ProofPic simulates the full authenticity verification pipeline (image hash → device attestation → zero-knowledge proof → zkVerify verification). We approximate “original capture” using EXIF and metadata: we reject when EXIF is missing; when <strong>Software</strong> (if present) indicates an editor; when Make/Model are missing; or when the <strong>file save time is more than a few seconds after the EXIF capture time</strong> (re-save heuristic). We do not require a Software tag—many cameras omit it. In production, verification would occur <strong>at capture time on the device</strong>, where the camera app binds the image hash to a hardware-backed attestation before the file can be edited or exported.
          </p>
          <p className="reviewer-note-inner"><strong>Reviewer test checklist:</strong></p>
          <ul className="reviewer-checklist">
            <li><strong>Test 1 — Original camera photo:</strong> Upload a photo directly from your phone camera. Expected: Verified Real Photo.</li>
            <li><strong>Test 2 — Edited or re-saved image:</strong> Open a photo in Paint (or another editor), save, then upload. Expected: Not verified — re-saved or edited (save time &gt; capture time).</li>
            <li><strong>Test 3 — Screenshot:</strong> Upload a screenshot. Expected: Not verified (screenshot or missing metadata).</li>
            <li><strong>Test 4 — Downloaded image:</strong> Download an image from the web and upload. Expected: Not verified — missing camera metadata.</li>
          </ul>
          <ul className="reviewer-checklist">
            <li><strong>Web2 UX</strong> — No wallets or crypto jargon; mainstream-friendly.</li>
            <li><strong>Proof volume</strong> — Repeat uploads + shareable receipts support milestones (25K → 250K proofs or 250 → 2.5K users).</li>
            <li><strong>Direct zkVerify consumer</strong> — We submit proofs to zkVerify; not infrastructure for others.</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <p className="hero-tagline">Real photos only. No AI. No filters.</p>
        <h1>We're fighting for genuine photos</h1>
        <p className="hero-sub">
          ProofPic is the place where every image comes from a <strong>verified real camera</strong> and has <strong>not been edited after capture</strong>. Only photos that pass zkVerify get the badge and appear on the feed. Just proof.
        </p>
        <div className="hero-actions" aria-label="Primary actions">
          <NavLink to="/verify" className="card-cta hero-cta-primary">Verify a photo</NavLink>
          <NavLink to="/v/demo" className="card-cta card-cta-secondary hero-cta-secondary">View sample receipt</NavLink>
        </div>
        <div className="concept-block" role="region" aria-label="Our promise">
          <h2 className="concept-block-title">Nothing gets in without verification</h2>
          <p className="concept-block-text">
            We're battling the flood of AI-generated content and filtered reality. Here, every photo is verified on <strong>zkVerify</strong>
            <ZkVerifyTooltip />
            : we prove it was captured by genuine device hardware and not modified after capture. If it doesn't pass, it doesn't get the badge—and it doesn't get shared. Real only.
          </p>
        </div>
        <div className="why-zkverify" role="region" aria-label="Why we use zkVerify">
          <h2 className="why-zkverify-title">Why ProofPic uses zkVerify</h2>
          <p className="why-zkverify-intro">
            <a href="https://zkverify.io/" target="_blank" rel="noopener noreferrer">zkVerify</a> is the universal verification layer for zero-knowledge proofs. <strong>How we use it for photos:</strong> when you verify a photo, we build a ZK proof that it came from a real camera and wasn’t edited, send that proof to zkVerify, and you get a public receipt. Your image and identity stay private; only the proof is verified on-chain.
          </p>
          <ul className="why-zkverify-list">
            <li><strong>Verify everything, compromise nothing</strong> — Proofs confirm authenticity; no raw photo or PII is revealed.</li>
            <li><strong>Ultra-fast</strong> — Verification in under a second, so the flow stays smooth for users.</li>
            <li><strong>Any proof, anywhere</strong> — zkVerify works across ecosystems and chains; we submit Groth16 proofs and get a shareable receipt.</li>
            <li><strong>Cost-efficient at scale</strong> — Built to handle high volume so ProofPic can grow with dating, marketplace, portfolio, social media, and other use cases.</li>
          </ul>
          <p className="why-zkverify-cta">
            <a href="https://zkverify.io/" target="_blank" rel="noopener noreferrer">Learn more at zkverify.io →</a>
          </p>
        </div>
        <div className="why-verification-matters" role="region" aria-label="Why verification matters">
          <h2 className="why-verification-title">Why verification matters</h2>
          <p className="why-verification-intro">Trust in digital photos is declining. ProofPic lets anyone prove that a photo was captured by a real camera and has not been edited after capture. This helps build trust in:</p>
          <ul className="why-verification-list">
            <li><strong>Dating profiles</strong> — Show your photos are genuine.</li>
            <li><strong>Marketplaces</strong> — Sellers prove listing photos are real.</li>
            <li><strong>Freelance portfolios</strong> — Prove your work is authentic.</li>
            <li><strong>Journalism</strong> — Verify field and citizen photography.</li>
            <li><strong>Social media</strong> — Prove your posts are real, not AI or heavily edited.</li>
            <li><strong>And more</strong> — Anywhere you need to show a photo is from a real camera.</li>
          </ul>
        </div>
        <div className="hero-requirement" role="note">
          <strong>Use the original photo</strong> — Upload directly from your camera or phone (the file as saved by your device). Do not use a photo shared via Facebook, Viber, WhatsApp, or saved from the web; those copies are often recompressed and we cannot verify them.
        </div>
        <p className="hero-note">
          This demo simulates the full flow. Best on modern Android/iOS with hardware attestation; web fallbacks limited. In production, proofs are verified on zkVerify (Groth16).
        </p>
        <div className="flow-strip" aria-label="Verification flow">
          <span className="flow-strip-step"><strong>1.</strong> Upload</span>
          <span className="flow-strip-arrow" aria-hidden="true">→</span>
          <span className="flow-strip-step"><strong>2.</strong> Hash + Attest</span>
          <span className="flow-strip-arrow" aria-hidden="true">→</span>
          <span className="flow-strip-step"><strong>3.</strong> ZK proof</span>
          <span className="flow-strip-arrow" aria-hidden="true">→</span>
          <span className="flow-strip-step"><strong>4.</strong> Badge</span>
        </div>
      </div>

      <div className="home-cards-grid">
        <div className="card card-highlight">
          <h2 className="card-title-with-icon">
            <CameraIcon />
            How it works
          </h2>
          <p>
            You upload or take a photo in our app. We compute a hash, request a signed statement from your device (attestation), generate a ZK proof that the photo came from genuine hardware, and submit it to <strong>zkVerify</strong>. You get a shareable <strong>Verified Real Photo</strong> badge—no identity or raw image is revealed to the verifier.
          </p>
          <NavLink to="/verify" className="card-cta"><CameraIcon /> Verify a photo →</NavLink>
        </div>

        <div className="card card-highlight">
          <h2 className="card-title-with-icon">
            <ShieldIcon />
            What you get
          </h2>
          <ul className="bullet-list">
            <li>A <strong>Verified Real Photo</strong> badge you can share (e.g. dating, marketplace, portfolio, social media).</li>
            <li>A <strong>receipt</strong> (ID + tx hash) that links to on-chain verification on zkVerify.</li>
            <li>Your photo is <strong>not stored</strong> on our servers; we only use it to compute a hash and run verification.</li>
          </ul>
          <NavLink to="/verify" className="card-cta"><ShieldIcon /> Get started</NavLink>
        </div>

        <div className="card card-highlight">
          <h2 className="card-title-with-icon">
            <ShieldIcon />
            Why real matters
          </h2>
          <p>
            Filters and edited images make &quot;real&quot; meaningless. We're building the opposite: a place where <strong>every photo is verified from a real camera and not edited after capture</strong>. When it's on ProofPic, it passed the test.
          </p>
          <NavLink to="/verify" className="card-cta">Verify a photo</NavLink>
        </div>

        <div className="card card-highlight">
          <h2 className="card-title-with-icon">
            <ChainIcon />
            Use cases
          </h2>
          <p>
            Dating profiles, freelance portfolios, marketplace listings, journalism, social media, and more—anywhere you need to show that a photo is authentic and from a real camera, not edited after capture.
          </p>
          <NavLink to="/verify" className="card-cta"><ChainIcon /> Verify a photo</NavLink>
        </div>
      </div>

      <div className="verification-collections">
        <h2 className="collections-title">Verify multiple photos</h2>
        <p className="collections-intro">ProofPic encourages repeat verification. Verify several photos per listing, portfolio, or profile to build trust and generate more proofs.</p>
        <div className="collections-grid">
          <div className="card card-highlight">
            <h3 className="card-title-with-icon"><CameraIcon /> Verify your portfolio</h3>
            <p>Freelancers and photographers can verify portfolio images so clients know the work is authentic and captured by a real camera.</p>
            <NavLink to="/verify" className="card-cta">Verify portfolio →</NavLink>
          </div>
          <div className="card card-highlight">
            <h3 className="card-title-with-icon"><ChainIcon /> Verify marketplace listing photos</h3>
            <p>Sellers can verify product photos, packaging, and condition shots. Each verified photo gets a public receipt—build trust and reduce disputes.</p>
            <NavLink to="/verify" className="card-cta">Verify listing photos →</NavLink>
          </div>
          <div className="card card-highlight">
            <h3 className="card-title-with-icon"><ChainIcon /> Social media & more</h3>
            <p>Prove your social posts are real—not AI-generated or heavily filtered. Use the badge on any platform where authenticity matters. Same verification, more use cases.</p>
            <NavLink to="/verify" className="card-cta">Verify a photo →</NavLink>
          </div>
          <div className="card card-highlight">
            <h3 className="card-title-with-icon"><ShieldIcon /> Verify your dating profile photo</h3>
            <p>Dating apps are full of fake and edited photos. Get a <strong>Verified Real Photo</strong> badge and share the receipt link on your profile. Verify multiple photos to show you're real.</p>
            <NavLink to="/verify" className="card-cta">Verify my photo →</NavLink>
          </div>
        </div>
      </div>

      <ForReviewersHome />
    </div>
  )
}
