# ProofPic — Verify Your Photos Are Real

A proof-of-concept web app: upload a photo and get a **Verified Real Photo** badge backed by a zero-knowledge proof that the image was captured by a real camera (not AI-generated or heavily edited). Verification is designed to run on [zkVerify](https://zkverify.io).

## Run the demo

```bash
cd ProofPic
npm install
npm run dev
```

Open **http://localhost:5173**. Use **Verify photo** to upload an image; the app simulates: image hash → device attestation → ZK proof → zkVerify submission → badge.

**Important:** For verification to be valid, the user must upload the **original photo** from the camera or phone (the file as saved by the device). Photos that were shared via Facebook, Viber, WhatsApp, etc., or saved/downloaded from the web are often recompressed and stripped of metadata, so they cannot be fully verified.

## What this PoC does

- **Home:** Pitch, “use the original photo” requirement, how it works, what you get, use cases, and a **For reviewers** collapsible checklist.
- **Verify photo:** Upload (original from camera/phone only), “What we verify” and “Your privacy” sections, **For reviewers** notes. On success, the photo is added to **Verified pictures**.
- **Verified pictures:** List of photos that passed verification (stored in `localStorage`). Each card shows thumbnail, date, receipt ID, tx hash, and image hash.

All crypto and zkVerify are **simulated** in the browser. Production would use:

- Real image hashing (e.g. SHA-256 or content hash).
- Device attestation (Android Play Integrity, iOS App Attest, or WebAuthn).
- A Groth16 circuit (e.g. Circom + snarkjs) and [zkVerifyJS](https://docs.zkverify.io/overview/zkverifyjs) for proof submission.

## Project layout

- `src/pages/Home.jsx` — Landing, what you get, use cases, For reviewers.
- `src/pages/VerifyPhoto.jsx` — Upload, step progress, badge result, What we verify / Privacy / For reviewers.
- `src/pages/VerifiedPictures.jsx` — List of verified photos with receipt details.
- `src/store/verifiedPhotos.js` — Persist verified entries and thumbnails (localStorage).
- `src/mock/verification.js` — Simulated hash, attestation, proof, and zkVerify.
- `IDEA-ProofPic.md` — Proposal and program-fit notes for Thrive zkVerify Web2.

## Design

UI and styling are adapted from the [ZK proof](../ZK%20proof) project (dark theme, cards, step indicator, success state).
