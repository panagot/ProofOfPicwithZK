import { NavLink, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VerifyPhoto from './pages/VerifyPhoto'
import VerifiedPictures from './pages/VerifiedPictures'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="logo" aria-label="ProofPic — Home">
            <span>ProofPic</span>
            <span className="accent">· zkVerify</span>
            <span className="logo-sublabel">Real only</span>
            <span className="mode-badge" aria-label="Demo mode">Demo</span>
          </NavLink>
          <div className="header-theme-wrap">
            <ThemeToggle />
            <nav className="nav-links" aria-label="Main navigation">
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/verify">Verify photo</NavLink>
              <NavLink to="/verified">Verified pictures</NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<VerifyPhoto />} />
          <Route path="/verified" element={<VerifiedPictures />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <p className="footer-tagline">
            ProofPic — We're fighting for genuine photos. Real cameras only; nothing gets in without passing <a href="https://zkverify.io" target="_blank" rel="noopener noreferrer">zkVerify</a>. No AI, no filters. This demo simulates the flow; production uses device attestation and Groth16 proofs.
          </p>
        </div>
      </footer>
    </>
  )
}
