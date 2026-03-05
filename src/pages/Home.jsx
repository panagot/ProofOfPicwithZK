import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function ForReviewersHome() {
  const [open, setOpen] = useState(false)
  return (
    <div className="reviewer-section">
      <button
        type="button"
        className="reviewer-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        For reviewers: quick checklist
      </button>
      {open && (
        <div className="reviewer-content">
          <ol>
            <li><strong>Verify photo</strong> — Upload an image (use the original from camera/phone, not from social apps). Run the flow and confirm you see: hash → attestation → proof → zkVerify → badge + receipt.</li>
            <li><strong>Verified pictures</strong> — After verifying, open this tab to see the photo listed with receipt ID, tx hash, and image hash.</li>
            <li><strong>Original-only</strong> — The app states that photos from Facebook, Viber, WhatsApp, or downloads cannot be fully verified (recompression/metadata stripping).</li>
            <li>This is a <strong>demo</strong>: attestation and zkVerify are simulated. Production would use Play Integrity / App Attest and real Groth16 proofs on zkVerify.</li>
          </ol>
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
          ProofPic is the place where every image comes from a <strong>verified real camera</strong>. Nothing gets a badge—and nothing gets on the feed—unless it passes our zkVerify verification. No AI-generated images, no deepfakes. Just proof.
        </p>
        <div className="concept-block" role="region" aria-label="Our promise">
          <h2 className="concept-block-title">Nothing gets in without verification</h2>
          <p className="concept-block-text">
            We're battling the flood of AI slop and filtered reality. Here, every photo is verified on <strong>zkVerify</strong>: we prove it was captured by genuine device hardware. If it doesn't pass, it doesn't get the badge—and it doesn't get shared. Real only.
          </p>
        </div>
        <div className="hero-requirement" role="note">
          <strong>Use the original photo</strong> — Upload directly from your camera or phone (the file as saved by your device). Do not use a photo shared via Facebook, Viber, WhatsApp, or saved from the web; those copies are often recompressed and we cannot verify them.
        </div>
        <p className="hero-note">
          This demo simulates the full flow: image hash → device attestation → ZK proof → zkVerify. In production, proofs are verified on zkVerify (Groth16).
        </p>
      </div>

      <div className="home-cards-grid">
        <div className="card card-highlight">
          <h2>How it works</h2>
          <p>
            You upload or take a photo in our app. We compute a hash, request a signed statement from your device (attestation), generate a ZK proof that the photo came from genuine hardware, and submit it to <strong>zkVerify</strong>. You get a shareable <strong>Verified Real Photo</strong> badge—no identity or raw image is revealed to the verifier.
          </p>
          <NavLink to="/verify" className="card-cta">Verify a photo →</NavLink>
        </div>

        <div className="card">
          <h2>What you get</h2>
          <ul className="bullet-list">
            <li>A <strong>Verified Real Photo</strong> badge you can share (e.g. dating, marketplace, portfolio).</li>
            <li>A <strong>receipt</strong> (ID + tx hash) that links to on-chain verification on zkVerify.</li>
            <li>Your photo is <strong>not stored</strong> on our servers; we only use it to compute a hash and run verification.</li>
          </ul>
          <NavLink to="/verify" className="card-cta">Get started</NavLink>
        </div>

        <div className="card">
          <h2>Why real matters</h2>
          <p>
            Deepfakes and AI-generated images are everywhere. Filters make "real" meaningless. We're building the opposite: a place where <strong>every photo is verified from a real camera</strong>. Dating, portfolios, marketplaces, journalism—when it's on ProofPic, it passed the test.
          </p>
          <NavLink to="/verify" className="card-cta">Verify a photo</NavLink>
        </div>

        <div className="card">
          <h2>Use cases</h2>
          <p>
            Dating profiles, freelance portfolios, marketplace listings, journalism, social media—anywhere you need to show that a photo is authentic and from a real camera, not AI or deepfake.
          </p>
          <NavLink to="/verify" className="card-cta">Verify a photo</NavLink>
        </div>
      </div>

      <ForReviewersHome />
    </div>
  )
}
