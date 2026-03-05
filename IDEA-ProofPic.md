# ProofPic — Verify Your Photos Are Real

*Proposal from ChatGPT, refined with Cursor; Grok validation and MVP path merged below.*

---

## One-line pitch

A mobile/web app where users upload photos and generate a zero-knowledge proof that the photo was taken by a real camera and not AI-generated or heavily edited.

---

## Program fit

| Criterion | How ProofPic fits |
|-----------|-------------------|
| **Use case** | Authenticity verification |
| **Program example** | "Authenticate that an image was captured by a specific camera" |
| **Product, not infra** | Users come to our app to verify photos and get a badge. We run the platform. No API/SDK for other companies. |

---

## Milestone structure (program)

At **M2** and **M3** the program requires **one metric** — you **choose either** transaction volume **or** unique users (not both).

| Milestone | When | Choose ONE of: |
|-----------|------|-----------------|
| **Application** | Approval | Technical plan, ZK UX design, ecosystem value, business plan (10% unlocked) |
| **M1: Live deployment** | 45 days post-approval | Production + zkVerify integration, beta testing, published docs (10%) |
| **M2: Initial traction** | 90 days post-approval | **25,000+ ZK proofs** sent to zkVerify **OR** **250+ unique users** interacting with zkVerify (30%) |
| **M3: Scale** | 150 days post-approval | **250,000+ ZK proofs** **OR** **2,500+ unique users** (50%) |

**Implication for ProofPic:** We can pursue the **user path** (250 → 2,500 users) or the **volume path** (25K → 250K proofs). The verified-feed product supports both: more users posting = more proofs; more proofs per user = volume. We commit to one path in the application and track it.

---

## Traction path

**Use cases that drive volume and users:**
- Dating profiles ("Verified Real Photo")
- Freelance portfolios, marketplace listings, journalism, social authenticity
- **Verified feed:** Social-style feed where every post is verified real → repeat visits, more posts = more proofs

**If we choose the user path (250 → 2,500):**
- M2: 250+ unique users who have verified at least one photo or interacted with the zkVerify integration (e.g. viewed feed, posted).
- M3: 2,500+ unique users. Verified feed + niche communities (photography, dating, authenticity) support growth.

**If we choose the volume path (25K → 250K proofs):**
- M2: 25,000+ verifications (e.g. ~100 users × 250 photos, or 250 users × 100 photos, or mix).
- M3: 250,000+ verifications. Repeat posting (verified feed, badges for multiple photos) drives volume.

---

## Technical approach (as proposed)

**Proof shows:**
- Photo contains valid sensor noise fingerprint (camera PRNU or similar).
- Metadata / signature matches camera pattern.
- File hash matches original (no tampering after capture).

**Circuit (conceptual):**
- Inputs: `photo_hash`, `camera_signature`, `sensor_noise_pattern`.
- Verifier: zkVerify (Groth16).

---

## Evaluation and refinements

### Strengths
- **Clear product:** One app, one action (upload → verify → badge). Not infrastructure.
- **Strong program fit:** Directly matches "authenticate that an image was captured by a specific camera" and authenticity.
- **Traction story:** Multiple verticals (dating, freelance, marketplace, journalism, social); repeat usage per user.
- **Mainstream UX:** "Verify this photo is real" is easy to explain; no crypto jargon.

### Technical caveats
- **Sensor noise (PRNU) in ZK is hard:** PRNU is a real-world signal (sensor fingerprint), but computing it inside a ZK circuit is heavy (lots of FFTs / correlation). Often done outside ZK: "trusted" component extracts a fingerprint, then you prove something about that in ZK (e.g. commitment, or match to a registered camera).
- **Pragmatic split:** Consider (1) **off-chain:** extract camera/sensor fingerprint and integrity hash; (2) **on-chain / zkVerify:** ZK proof that "I know a valid fingerprint + hash that matches the registered camera / meets authenticity rules" without revealing the full image or raw fingerprint. That keeps the circuit manageable and still gives you "verified by real camera" semantics.
- **Metadata/signature:** "Metadata signature matches camera pattern" is a good direction: if the capture app signs (hash of image + timestamp) with a hardware-backed or attestation-bound key, the ZK proof can be "I know a signature from a genuine device for this image hash" — easier to implement than full PRNU in-circuit.

### Suggested technical simplification for MVP
1. **Capture-time binding:** In our app, when the user takes (or uploads) a photo, we get a **signed statement** from the device (e.g. hardware-backed key or attestation): "This image hash H was captured at time T by this device."
2. **Commitment:** We store a commitment to (device_id or public key, H, T) or only H + signature.
3. **ZK proof:** "I know an image hash H and a valid signature from a genuine device for H" (and optionally "H is the hash of the image I'm claiming"). Verification on zkVerify (Groth16).
4. **Later:** Add PRNU or other sensor checks **off-circuit** and feed a "valid sensor fingerprint" bit into the circuit if needed for stronger "real camera" guarantees.

This keeps M1 (live deployment) achievable while still delivering "verified real photo" and hardware authenticity.

---

## Summary

| Item | Status |
|------|--------|
| Program alignment | Strong (authenticity, camera example) |
| Product vs infrastructure | Clearly a product we run |
| Traction narrative | Good (multiple use cases, repeat usage) |
| Technical feasibility | Achievable with capture-time signing + ZK; full PRNU in-circuit is a later phase |

ProofPic is a strong candidate for the program. Grok (March 2026): "One of the best-aligned ideas yet — hits their example verbatim, drives proofs via repeat/viral consumer use, and screams web2 product not infra." Recommend adopting the "signed capture + ZK" path for the technical plan and treating sensor fingerprinting as an enhancement.

---

## Grok — Why this fits (program alignment)

- **Use case:** Direct match to "Authenticate that an image was captured by a specific camera"; extends to real-camera vs AI-generated/edited.
- **Web2 + mainstream:** Simple upload → verify → badge; no ZK/wallet jargon.
- **Product, not infra:** Users come to our app; we run the platform; no API/SDK for others.
- **Grant mechanics:** 10% at approval, 10% at live deployment, 30% at traction, 50% at scale. Rolling approvals; program still wide open — good window to apply.

---

## Grok — Recommended MVP path

### App flow
1. User takes or uploads photo in-app (camera access or file picker).
2. App computes image hash **H**.
3. Use **device attestation / hardware-backed signing** (Android Play Integrity / SafetyNet, iOS DeviceCheck / App Attest, or WebAuthn on web) to get a signed statement: *"Device certifies H was freshly captured at T by genuine hardware."*
4. Generate ZK proof: *"I know H and a valid attestation/signature from a certified genuine device for this H"* (proves no post-capture tampering/AI injection when capture is bound).
5. Submit proof to **zkVerify** → get verification receipt.
6. Display **"Verified Real Photo"** badge (optional: shareable link; keep web2-simple).

### ZK circuit (lightweight Groth16)
- **Public inputs:** Image hash H (or commitment), verification receipt ID from zkVerify.
- **Private inputs:** Signature/attestation data proving knowledge of valid device cert for H.
- **Output:** Bit = 1 if signature verifies against trusted device roots.

Feasible with Circom/snarkjs; zkVerify supports this. Keeps circuits small and verification cheap.

### Enhancements for later milestones
- Off-chain PRNU/sensor noise check → prove "fingerprint matches real-camera distribution" via simpler ZK bit.
- Optional: User registers a "camera profile" once (prove ownership of device), then link future photos.
- Integrate with external capture apps (e.g. pro photography tools with signed capture).

---

## Grok — Risks & mitigations

| Risk | Mitigation |
|------|------------|
| **Competition/overlap** | No exact "proof of real photo" in zkVerify ecosystem yet; deepfakes make this timely (2026). |
| **User acquisition** | Early traction needs marketing: partner with dating subs, Reddit marketplaces, freelance platforms; highlight badge virality in proposal. |
| **Technical coverage** | Device attestation is stronger on mobile than web. **Start mobile-first;** fallback to metadata + basic tamper checks for web. |

---

## Business model (for application)

- **Freemium:** Basic verifies free (e.g. N per month); premium = unlimited verifies, custom badges, or watermark options.
- **Revenue:** Premium subscriptions and/or one-off verify packs; optional B2B later (position as **consumer product first** to avoid "infrastructure" framing).

---

## Application checklist (before submit)

- [ ] Wireframes or mockups: upload screen → verification → badge.
- [ ] Estimated proof math in proposal (e.g. 250 users × 10 photos = 2.5K proofs; path to 25K/250K).
- [ ] Revenue path clearly stated (freemium + sustainability beyond grant).
- [ ] Technical plan: attestation → commitment → ZK proof → zkVerify (Groth16).
- [ ] Mobile-first + web fallback noted.

---

## Direction: Verified feed (“Instagram 2.0” for real photos)

**Idea:** Evolve ProofPic into a **social-style feed** where every post is a **verified-real photo**. Users verify then post; visitors browse a feed of “real only”—no AI-generated, no heavy filters. Like “Instagram 2.0” in the sense of a place built around **authenticity first**.

### Why it helps milestones (250 → 2,500 users)

- **Retention:** People come back to post more verified photos and to see others’ posts. That drives both **unique users** and **proof volume** (each post = 1 verification).
- **Network effects:** More users → more content → more reason to join. Fits “sustainable growth” and “significant proof volume.”
- **Clear product:** We still run the app and the feed. Not infrastructure for others—so it stays aligned with “no infrastructure.”
- **Differentiation:** “The feed where every photo is verified real” is a clear, timely angle (deepfakes, AI, filtered reality).

### MVP scope (to hit M2/M3 without building a full social network)

- **Feed:** Public or logged-in feed of verified photos only (each tile links to receipt / verification).
- **Post flow:** Verify photo (current flow) → option to “Post to feed.” No post without verification.
- **Profile / “My verified”:** User sees their own verified photos (we already have “Verified pictures”); can expose a simple public profile or pseudonymous handle.
- **Optional for v1:** Likes, follows, or comments to boost engagement and return visits. Skip DMs, stories, discovery algo, and heavy moderation in the first version.

### Positioning

- Not “we replace Instagram,” but “the place for **real** photos”—a niche: authenticity-first social.
- Tagline-style: “The feed where every photo is verified real.” / “Real photos only. No AI. No filters.”

### Risks to watch

- **Moderation:** Any public feed needs basic content moderation (report, block, take-down). Plan a minimal policy and flow.
- **Scope:** Keep v1 to: verify → post to feed → browse feed (+ optional likes/follows). Add discovery and richer social features after M2/M3 if needed.
