# ProofPic — Problem, Goals, and Request for Guidelines

*Use this document to brief Grok, ChatGPT, or other AIs when asking for guidelines on verification logic, UX, or product direction.*

---

## The problem we're solving

- **Flood of synthetic and edited imagery:** Deepfakes, AI-generated images, and heavily edited photos make it hard to trust that a photo is a genuine capture from a real camera. People want to prove that an image is “real” (from a real device, not AI, not doctored) for dating, marketplaces, portfolios, journalism, and social credibility.

- **No simple, verifiable signal:** Today there’s no widely adopted way to cryptographically prove “this image was captured by this camera at this time” without trusting a central party with the raw file. We want to tie authenticity to **device attestation** and **zero-knowledge proofs** so that verifiers see only “this photo passed” (e.g. on zkVerify), not the image or identity.

- **Edited vs original:** Even when a photo starts from a real camera, **any edit** (crops, filters, Paint-style annotations, re-saves, screenshots, copies from messaging apps) can change the file and break the chain of trust. So “genuine” must mean: **original capture from the device**, or at least **no post-capture edits** that we can detect or that break the attestation binding.

---

## What ProofPic is trying to achieve (in general)

1. **Product, not infrastructure**  
   Users come to **our** app to verify their photos and get a shareable “Verified Real Photo” badge. We run the platform and the verification flow. We are **not** building an API/SDK for other companies to integrate.

2. **One clear promise**  
   “This image was captured by a **real camera** (genuine device hardware) and has **not** been AI-generated or meaningfully edited in a way that breaks authenticity.” In production, that would be enforced by:
   - **Capture-time binding:** The device (camera app / our app) hashes the image and gets a hardware-backed attestation **before** the file is exported or edited.
   - **ZK proof:** We prove “I know an image hash H and a valid attestation from a certified genuine device for H” and submit to zkVerify. An edited or re-saved copy would have a different H and no valid attestation, so it would **not** verify.

3. **Mainstream UX**  
   No wallets, no crypto jargon. User: “Upload or take a photo → we verify it → you get a badge and a receipt.” Verification happens in the background; the output is “Verified” or “Not verified” with a clear reason.

4. **Traction path**  
   Use cases: dating profiles, freelance portfolios, marketplaces, journalism, social authenticity. Optional “verified feed” where only verified photos appear. Program milestones (e.g. 25K proofs or 250 users, then 250K proofs or 2.5K users) drive how we position the product.

5. **Demo vs production**  
   Our **current demo** simulates the full flow (hash → attestation → ZK proof → zkVerify). We don’t have real device attestation yet, so we use **heuristics** (e.g. EXIF: presence of EXIF, Software tag, editor names) to **reject** images that look edited or re-saved, so that reviewers see the intended behavior: “edited = not verified.” In **production**, verification would be at capture time on the device; edited copies would fail because they wouldn’t have a valid attestation for their hash.

---

## What we need guidelines on

We’d like **concrete, actionable guidelines** from you (Grok / ChatGPT) on the following. You can assume the context above.

### 1. When should we treat a photo as “not genuine” in the demo?

- **EXIF:** What rules make sense? (e.g. no EXIF → reject? EXIF but “Software” from a known editor → reject? EXIF but no Software tag → reject or allow?)
- **Filenames / origins:** Should we use filename patterns or other signals (e.g. “screenshot”, “copy”, “edited”) to reject or warn?
- **Other metadata or signals:** Any other heuristics (e.g. image dimensions, format, re-compression artifacts) that are reasonable for a **demo** (no ML, no heavy analysis) to “reject as possibly edited or re-saved”?

### 2. How to explain “original only” to users

- **Copy:** Short, clear wording for: “Use the **original** photo from your camera or phone. Do not use a photo that was shared via messaging/social, downloaded from the web, or edited (e.g. in Paint, filters, crop-and-save).”
- **Failure messages:** When we reject, what exact messages are best for (a) “edited / saved by an editor”, (b) “no EXIF / possibly re-saved”, (c) “other” — so users understand why they were rejected and what to do next.

### 3. Reviewer-facing clarity

- How to describe in one short paragraph that “in this demo we use EXIF/metadata heuristics to approximate ‘edited = not verified’; in production, verification happens at capture time and edited copies would fail attestation.”
- A minimal **checklist** for program reviewers (e.g. “Try an original camera photo → should pass; try a Paint-edited or re-saved JPEG → should fail with a clear reason”).

### 4. Boundaries of the demo

- What should we **not** promise in the demo? (e.g. “We do not run ML-based edit detection”; “We do not guarantee detection of all edits.”
- Any disclaimers or caveats we should show in the UI or in reviewer notes?

---

## What we’ve implemented so far (for context)

- **Demo edit check (EXIF):** For JPEGs we (1) require an EXIF block; (2) require a Software tag in EXIF; (3) reject if Software matches known editors (Paint, Microsoft, Photoshop, GIMP, etc.). No EXIF → reject. No Software tag → reject (to catch re-saved files that kept EXIF but lost Software).
- **Flow:** Upload → hash (simulated) → attestation (simulated) → ZK proof (simulated) → zkVerify (simulated) → “Verified Real Photo” or “Not verified” with a reason.
- **UI:** “Not verified” card with the failure reason; copy that says to use the original from camera/phone and not an edited or re-saved copy.

We want your guidelines to **refine** these rules and messages (what to reject, how to explain it, what to tell reviewers) so the demo behaves and communicates in a way that matches our goals above.

---

## How to respond

Please provide:

1. **Demo rejection rules:** Recommended EXIF/metadata (and any other simple) rules for “reject as possibly edited or re-saved,” with short rationale.
2. **User-facing copy:** Suggested wording for “use original only” and for 2–3 specific failure reasons.
3. **Reviewer paragraph + checklist:** One short paragraph and a bullet checklist so reviewers can quickly validate that the demo “works as intended.”
4. **Caveats / disclaimers:** What we should explicitly not claim or should disclaim in the demo.

You can assume the audience is both **end users** (who want to verify a photo) and **program reviewers** (who need to see that “edited = not verified” and understand the path to production.)
