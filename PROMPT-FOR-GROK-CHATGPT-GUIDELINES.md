# ProofPic — Brief for fresh feedback (Grok / ChatGPT)

*Send this to get a new round of feedback. The product and demo have evolved; we want your honest take on what’s strong, what’s missing, and what would help most for the grant application.*

---

## What ProofPic is

**ProofPic** is a web app where users upload a photo and get a **Verified Real Photo** badge backed by a zero-knowledge proof that the image was captured by a real camera (not AI-generated, not meaningfully edited). We’re applying to the **Thrive zkVerify Web2 Program** (authenticity verification; “authenticate that an image was captured by a specific camera”). We run the product ourselves—no API/SDK for other companies.

**Promise:** “This photo came from a real camera and wasn’t edited or re-saved in a way that breaks trust.” In production we’d enforce that with **capture-time attestation** on the device (hash + hardware-backed signature before the file is ever exported or edited). Edited copies would have a different hash and no valid attestation, so they’d fail.

---

## What we’ve built (current demo)

- **Live flow:** Upload photo → EXIF/metadata check → (if pass) simulated hash → attestation → ZK proof → zkVerify → **Verified Real Photo** and receipt. Failures show **Not verified** with a clear reason.
- **Rejection rules (demo heuristics):**
  - No EXIF → reject.
  - EXIF but **Software** tag matches known editors (Paint, Microsoft, Adobe, Photoshop, GIMP, Canva, Snapseed, Lightroom, WhatsApp, Instagram, etc.) → reject.
  - No **Software** tag or no **Make/Model** in EXIF → reject.
  - **PNG** → reject (we only accept JPEG for verification).
  - Filename looks like **screenshot** (e.g. `Screenshot`, `IMG_*-WA`) → reject.
  - **Re-save heuristic:** If the file’s last-modified time is more than **2 hours** after the EXIF capture date, we reject as “re-saved or modified” (e.g. edited in Paint and saved later).
- **Public verification receipt:** Each verified photo gets a shareable page `/v/:receiptId` with Proof ID, verification time, hash, “Verified on zkVerify,” and optional thumbnail.
- **Verified Photo Feed:** List of verified photos with Proof ID and “View public receipt” link (stored in browser for demo).
- **Dating CTA:** Home has a “Verify your dating profile photo” section.
- **Reviewer content:** Collapsible “For reviewers” on Home and Verify with paragraph (demo heuristics vs production capture-time) and test checklist: (1) Original camera photo → Verified. (2) Same photo after editing in Paint and saving → Not verified (re-saved). (3) Screenshot / downloaded image → Not verified.
- **Disclaimers:** We state that the demo uses metadata heuristics, doesn’t do forensic analysis, and that production would use hardware attestation at capture time.
- **Script:** We have `scripts/check-exif.cjs` to run the same EXIF checks on a local file (for debugging).

**Deployment:** App is deployed (e.g. Vercel); we can share the URL for a live look.

---

## What we want from you (fresh feedback)

1. **Overall:** What’s working well? What feels missing or weak for a grant reviewer or an end user?
2. **Application / pitch:** What would you add, cut, or reframe in the application or in the way we describe ProofPic to maximize chances with the zkVerify program?
3. **Demo:** Any rejection rules you’d add or relax? Any failure messages you’d reword? Any UX change (e.g. one more screen, one less step) that would make the value or the ZK flow clearer?
4. **Risks or gaps:** What could reviewers or users reasonably criticize, and how would you address it in the app or in the written application?
5. **One thing:** If you could only suggest *one* change to the product or the application, what would it be?

No need to repeat long guidelines we’ve already implemented. We’re looking for **new** observations and concrete suggestions so we can refine before and after submission.
