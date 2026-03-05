# Thrive zkVerify Web2 Program — Application structure (grant-optimized)

*Use this 5-section narrative when writing the ProofPic application. It matches what reviewers typically expect and answers the questions they care about.*

---

## 1. Problem (Why this matters)

**Headline:** Trust in digital photos is rapidly declining.

**Body:** AI-generated images and easy editing tools make it increasingly difficult to know whether a photo is authentic. This affects many everyday situations: dating profiles, online marketplaces, freelance portfolios, journalism and citizen reporting.

Today there is **no simple way to prove that a photo was captured by a real camera and has not been edited after capture**. Most verification approaches require trusting a central platform or sharing sensitive data. Users need a **privacy-preserving way to prove photo authenticity**.

---

## 2. Solution (What ProofPic does)

**ProofPic** is a web application that allows users to verify that a photo was captured by a real camera device and has not been modified after capture.

Users upload a photo and receive a **Verified Real Photo** badge backed by a **zero-knowledge proof**.

**Key product features:**
- Photo authenticity verification
- Public verification receipts
- Verified photo feed
- Shareable authenticity badge

Users can share verification receipts publicly to demonstrate that their photos are genuine.

**Use cases:** verifying dating profile photos, marketplace listing photos, freelance portfolio images, journalism or field photography.

Importantly, ProofPic is **a standalone application with its own users**, not infrastructure for other platforms.

---

## 3. How zero-knowledge is used

ProofPic uses zero-knowledge proofs to verify photo authenticity **without revealing the original image or device identity**.

**Verification flow:**
1. The image hash is generated.
2. The device produces an attestation that the image was captured by genuine camera hardware.
3. A zero-knowledge proof is created demonstrating: knowledge of the image hash, and a valid device attestation.
4. The proof is submitted to **zkVerify** for verification.

This allows third parties to confirm authenticity **without access to the image or device information**.

In the current demo, device attestation is simulated and authenticity checks are approximated using EXIF metadata heuristics. In production, ProofPic will use **capture-time hardware attestation** to bind the image hash to the camera device before any edits occur.

---

## 4. Traction strategy (How we reach milestones)

ProofPic targets consumer use cases where authenticity matters.

**Initial growth segments:**
- **Dating profile verification** — Users verify profile photos and share a “Verified Real Photo” badge.
- **Marketplace listing verification** — Sellers verify multiple listing photos to prove authenticity of items.
- **Portfolio authenticity** — Freelancers and photographers verify images in their portfolios.

Each user typically verifies **multiple photos**, creating repeat proof generation.

**Example adoption:**
- 2,000 users × 5 photos each = 10,000 proofs  
- 5,000 users × 5 photos each = **25,000 proofs** (exceeds Milestone 2)

ProofPic includes a **public verified photo feed**, encouraging ongoing participation and additional verifications.

---

## 5. Milestones (What we will deliver)

**Milestone 1 — Core product (30–60 days)**  
- Improve verification UX  
- Integrate proof generation pipeline  
- Public verification receipts  
- Verified photo feed  

**Milestone 2 — Traction (90 days)**  
- **250+ unique users** OR **25,000+ ZK proofs** submitted to zkVerify  
- Growth via dating profile, marketplace, and portfolio verification  

**Milestone 3 — Scale (150 days)**  
- **2,500+ users** OR **250,000+ ZK proofs**  
- Improved device attestation support, mobile capture workflow, expanded verified feed  

---

## Bonus: Why zkVerify

ProofPic uses **zkVerify** as the verification layer because it provides scalable verification for zero-knowledge proofs while keeping user data private. This ensures high-volume authenticity verification without exposing sensitive information.

---

## What this structure achieves

| Reviewer question           | Section    |
|----------------------------|------------|
| Is the problem real?       | Problem    |
| Is the product clear?       | Solution   |
| Why use ZK?                 | ZK usage   |
| Will people actually use it?| Traction   |
| Can it reach milestones?    | Milestones |
