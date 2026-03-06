import { useState, useRef, useEffect } from 'react'

const ZKVERIFY_URL = 'https://zkverify.io/'

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

/**
 * Tooltip that explains zkVerify and links to zkverify.io.
 * Use next to "zkVerify" in copy for context without cluttering the page.
 */
export default function ZkVerifyTooltip() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const handleEscape = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <span className="zkverify-tooltip-wrap" ref={wrapRef}>
      <button
        type="button"
        className="zkverify-tooltip-trigger"
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        aria-expanded={open}
        aria-label="What is zkVerify? Open info"
        title="What is zkVerify?"
      >
        <InfoIcon />
      </button>
      {open && (
        <div className="zkverify-tooltip-panel" role="tooltip">
          <p className="zkverify-tooltip-title">What is zkVerify?</p>
          <p className="zkverify-tooltip-text">
            zkVerify is the <strong>universal verification layer</strong> for zero-knowledge proofs. <strong>For photos:</strong> we turn your photo into a proof (real camera, not edited), send it to zkVerify, and you get a shareable receipt—no wallet, no raw image shared. Ultra-fast verification; works with Groth16 and Web2.
          </p>
          <a
            href={ZKVERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="zkverify-tooltip-link"
          >
            Learn more at zkverify.io →
          </a>
        </div>
      )}
    </span>
  )
}
