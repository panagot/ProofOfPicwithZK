# Thrive zkVerify Web2 Program — ProofPic Submission Draft

**Use this draft when filling the official application form.** Adapt wording to fit character limits. Keep a copy of your final submitted answers elsewhere (e.g. in ZKsubmission/ or private notes).

**Program:** Thrive zkVerify Web2 Program  
**Project:** ProofPic — Verified Real Photo (photo authenticity verification)  
**Live demo:** https://proof-of-picwith-zk.vercel.app/

---

## 1. Please provide Github or other links that show proficiency in ZKP Technology.

**GitHub repo:** https://github.com/panagot/ProofOfPicwithZK

The repo contains the ProofPic demo app: a React/Vite frontend with a full verification flow (upload → EXIF-based authenticity checks → simulated device attestation → ZK proof simulation → zkVerify-style receipt). We demonstrate proficiency in ZKP integration by (1) defining a clear proof statement (photo hash + device attestation), (2) producing shareable verification receipts that mirror zkVerify’s model (proof ID, tx hash, public inputs, verification contract), and (3) building a Web2-friendly UX with no wallets or crypto jargon. The demo includes EXIF parsing for “original capture” heuristics (reject edited/re-saved/screenshot images), a public sample receipt at `/v/demo`, and a verified photo feed. In production we will integrate real Groth16 proof generation and zkVerify submission (zkVerifyJS or API). Documentation: README, APPLICATION-STRUCTURE.md, PROMPT-FOR-GROK-CHATGPT-GUIDELINES.md.

---

## 2. Why do you believe your project should be supported through the Thrive zkVerify program? What value does your project bring to the zkVerify ecosystem?

ProofPic brings **real proof volume** to zkVerify in a new vertical: **photo authenticity**. We are a consumer app where users verify that a photo was captured by a real camera and not edited after capture. Every verification becomes a ZK proof submitted to zkVerify and a shareable “Verified Real Photo” receipt. We are Web2-native: no wallets, no chain jargon; users just upload a photo and get a badge. Use cases (dating profiles, marketplaces, freelance portfolios, journalism) naturally generate **repeat verifications per user** (e.g. 5+ photos per profile or listing), which directly drives proof volume toward program milestones (25K → 250K proofs). We surface “Verified on zkVerify” and public receipts so the ecosystem sees our contribution. We are a **direct zkVerify consumer** (we submit proofs; we are not infrastructure for other builders). ProofPic makes zkVerify the verification rail for trust in visual content.

---

## 3. How much in funding are you asking for?

**30000** (or the program’s stated amount if different)

---

## 4. Please line item how you will use funding from Thrive zkVerify.

(1) **Production proof pipeline and zkVerify integration:** Finalize the Groth16 circuit (image hash + device attestation) and backend integration with zkVerify (Volta/mainnet) so proof generation and submission are stable and production-ready.

(2) **Deployment and hosting:** Deploy and host ProofPic for live verification so users can verify photos and receive on-chain receipts in production.

(3) **Documentation and materials:** Maintain and extend docs (architecture, verification flow, EXIF/attestation logic, sample receipt, use cases) in the repo and for reviewers.

(4) **Traction and pilots:** Run initial growth and pilot use cases (e.g. dating profile verification, marketplace listing verification) to validate volume, UX, and the end-to-end proof flow to zkVerify.

---

## 5. Please submit your business plan including your revenue model. Describe how your project will be successful beyond the grant period.

**Revenue model (post-grant):** Monetization can include (a) premium verification tiers or credits (e.g. higher volume or priority verification), (b) B2B/API access for platforms (dating apps, marketplaces) that want to offer “Verified Real Photo” to their users, (c) optional white-label or partner integrations. Revenue scales with verification volume and number of integrated use cases.

**Success beyond the grant:** ProofPic will measure success by **proof volume** and **user adoption**. We will grow through dating, marketplace, and portfolio use cases; each user verifies multiple photos, amplifying proof count. We will report metrics (verifications, unique users, receipts) and align with program milestones. Sustainability comes from usage-based revenue and visibility as the go-to photo authenticity layer on zkVerify.

---

## 6. What type(s) of ZK Proofs will you be using?

**Groth16.** Our proof statement: the prover knows an image hash and a valid device attestation showing the photo was captured by genuine camera hardware and not modified after capture. We use the zkVerify-supported Groth16 format for submission and receipt. In production we will generate proofs server-side (or device-side at capture time) and submit via zkVerify.

---

## 7. How will you be sending your proofs to zkVerify — zkverify.js, API integration, or other? And are you generating your proofs server side, client side, or somewhere else?

We will send proofs to zkVerify using **zkVerifyJS** (official JS SDK) and/or the **zkVerify API**, depending on production architecture. Proof generation will be **server-side** (backend holds attestation data, runs the circuit, produces proof and public signals, submits via zkVerifyJS/API). The client (browser or mobile) uploads the photo and triggers the flow; it does not generate or send the proof. Optionally, for capture-time verification, proof generation could move to the device with a native/SDK integration; submission would still go through our backend or a zkVerify-integrated path. We accept Thrive zkVerify’s standard terms for submission method.

---

## 8. Detail your technical plan showing how zero-knowledge proofs will be integrated and verified using zkVerify.

**Flow:** (1) User uploads a photo. (2) We compute an image hash and run authenticity checks (in the demo: EXIF-based heuristics; in production: capture-time device attestation). (3) A ZK proof is generated that attests: knowledge of the image hash and a valid device attestation (photo from real camera, not edited after capture). (4) The proof is submitted to zkVerify; zkVerify verifies on-chain and returns a receipt (proof ID, tx hash, etc.). (5) The user receives a “Verified Real Photo” badge and a shareable public receipt.

**Technical components:** Groth16 circuit (image hash + attestation as private/public inputs), backend proof generation (WASM/zkey or equivalent), zkVerify submission via zkVerifyJS/API, funded account (e.g. tVFY on Volta) for submission. The demo app (GitHub: ProofOfPicwithZK) simulates this pipeline and shows the receipt format; production will replace simulation with real proof generation and zkVerify integration. Full technical detail will be documented in the repo (architecture, verification flow, integration steps).

---

## 9. Describe your user experience and how ZK Proofs will be integrated without requiring blockchain knowledge from users.

Users never see “ZK,” “proof,” or “blockchain.” They see: **“Verify a photo”** → upload → **“Verified Real Photo”** badge and a shareable receipt link. No wallet, no gas, no chain jargon. The receipt page shows human-friendly fields (e.g. “Verified on zkVerify,” “Device / camera,” “Capture time”); technical fields (proof ID, tx hash, verification contract) are available for transparency but are not required to understand the result. Users can share the receipt link on dating profiles, marketplace listings, or portfolios to prove authenticity. We abstract all ZK and chain details so the experience is the same as using a normal photo verification or badge service.

---

## 10. How will you track and report user metrics, API calls, verification volume, and zkVerify integration usage?

We will track: **verifications per user**, **total proofs submitted to zkVerify**, **unique users**, and **receipt views/shares**. We can report aggregate metrics (verifications per day, growth over time) in milestone and program reporting. We will not track or report PII; only aggregate counts and pseudonymous identifiers where needed for fraud prevention or support. zkVerify integration usage is visible on-chain (proof volume, receipts); we will align our reporting with that where useful.

---

## 11. Are you considering any tokenization or blockchain elements for your application? If so, what are they?

**No.** ProofPic does not plan tokenization or additional blockchain elements beyond submitting ZK proofs to zkVerify and displaying on-chain verification receipts.

---

## 12. Do you accept Thrive zkVerify's standard milestones?

**Yes.**

---

## 13. If you are looking for custom milestones, please enter them here.

We are not requesting custom milestones. We will follow the program’s standard milestone structure.

---

## Quick checklist before submit

- [ ] Replace placeholder funding amount if the form specifies a different range.
- [ ] Confirm GitHub repo URL and add any new docs (e.g. architecture, zkVerify integration) before submitting.
- [ ] Ensure live demo URL is correct and all routes (e.g. /verify, /v/demo) work.
- [ ] Copy final answers into a private backup (e.g. ZKsubmission/important-proofpic.md) and do not push that file to the public repo if it contains sensitive data.
