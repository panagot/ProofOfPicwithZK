# ProofPic — AI agent review: service / site feedback and improvement suggestions

*Independent review of the ProofPic codebase, UX, and grant readiness. Treat as a fresh pair of eyes.*

---

## 1. Executive summary

ProofPic is a **coherent, grant-ready demo** with clear alignment to the Thrive zkVerify program (“authenticate that an image was captured by a specific camera”). The product is clearly an **application**, not infrastructure. The main gaps are in **discoverability of the verify flow**, **mobile experience**, **accessibility**, and a few copy/consistency tweaks. Below: strengths, then prioritized improvements.

---

## 2. What’s working well

### 2.1 Product clarity
- **Single promise:** “Captured by a real camera, not edited after capture” is clear and avoids overclaiming (e.g. “AI detection”).
- **Use cases** are concrete: dating, marketplace, portfolio, journalism. “Verify multiple photos” and collections (dating, marketplace, portfolio) support the **proof volume** narrative.
- **Why verification matters** and the flow strip (Upload → Hash + Attest → ZK proof → Badge) make the value and pipeline obvious.

### 2.2 Verification logic
- EXIF-based rules (no EXIF, editor in Software, no Make/Model, PNG, screenshot filename, re-save (file save more than a few seconds after EXIF capture)) are **documented and consistent** with the “original only” message.
- Relaxed “no Software required” and re-save window (a few seconds after capture) reduce false rejections while still catching obvious re-saves/edits.
- `scripts/check-exif.cjs` gives a **debug path** for support and reviewers.

### 2.3 Reviewer experience
- **For reviewers** sections (Home + Verify) and the **test checklist** (original → pass; edited/re-saved → fail; screenshot/downloaded → fail) lower evaluation friction.
- **Sample receipt** (`/v/demo`) and **Verification pipeline** (with checkmarks) make the ZK flow visible without requiring an upload.
- **APPLICATION-STRUCTURE.md** gives a clear 5-part outline for the written application.

### 2.4 Technical structure
- Routes and data flow are simple: Home, Verify, Verified feed, `/v/:receiptId`. `verifiedPhotos` store + receipt lookup is easy to replace with a backend later.
- Light/dark theme and OG meta are in place. No obvious security issues in the demo (no secrets in client, no unsafe `innerHTML`).

---

## 3. Improvement suggestions (prioritized)

### High priority

#### 3.1 Make “Verify photo” the primary CTA above the fold
- **Issue:** Home has a lot of content before the first “Verify a photo” action. Users and reviewers may not immediately see where to act.
- **Suggestion:** Add a single, prominent “Verify a photo” button (or link) in the hero, directly under the tagline or subtext (e.g. next to or replacing the flow strip in prominence). Keep the flow strip; ensure the main CTA is visible without scrolling.

#### 3.2 Verify page: reduce scroll before the file input
- **Issue:** Verify page has hero text, requirement box, instruction graphic, disclaimer, reviewer callout, pipeline visual, and info blocks before “Choose a photo.” On small screens this is a long scroll.
- **Suggestion:** Consider a two-column layout on desktop (short intro + **file input card** on the right) or move “Choose a photo” higher (e.g. right after the first paragraph). Alternatively, add a sticky “Verify a photo” CTA in the header that scrolls to the file input.

#### 3.3 Mobile: touch targets and file input
- **Issue:** File input and buttons must be easy to tap on phones; small tap areas and cramped spacing hurt completion.
- **Suggestion:** Ensure `.card-cta`, file input, and primary buttons have at least ~44px height and adequate padding. On the Verify page, make the “Choose a photo” card full-width on mobile and give the input a large hit area (e.g. padding + “Tap to upload” overlay).

#### 3.4 Verified feed: empty state when list is empty
- **Issue:** Empty state is clear; consider making the “Verify a photo” CTA even more prominent and optionally adding “Or view a sample receipt” linking to `/v/demo` so first-time visitors see an example outcome.
- **Suggestion:** Add a secondary link “View sample receipt” under the main CTA on the empty state.

### Medium priority

#### 3.5 Copy consistency: “No AI” in tagline vs body
- **Issue:** Hero tagline still says “No AI. No filters.”; body copy has been shifted to “not edited after capture.” The tagline is memorable; the body is more precise.
- **Suggestion:** Either (a) keep tagline as is and add one line in the hero that says “Captured by a real camera, not edited after capture,” or (b) change the tagline to something like “Real photos only. Real camera. No edits.” so the whole hero is aligned. Option (a) is lower risk for brand recall.

#### 3.6 Verified feed page: align with “no AI” phrasing
- **Issue:** Verified feed says “No AI, no filters.” Consider aligning with “captured by a real camera, not edited after capture” for consistency.
- **Suggestion:** One line: “Every photo here was verified as captured by a real camera and not edited after capture.”

#### 3.7 Accessibility
- **Issue:** Snapshot suggests focus management and screen-reader flow could be improved (e.g. after verification success or error, focus should move to the result or to the “Try another photo” button).
- **Suggestion:** On Verify page, after `setStep('done')` or `setStep('error')`, use a `useEffect` to focus a result heading or the primary action button (e.g. “View public receipt” or “Try another photo”) so keyboard and screen-reader users get clear feedback.

#### 3.8 Error state: optional recovery hint
- **Issue:** Failure card shows the message and “Try another photo.” Some users might not know whether to try a different file or the same one from a different source.
- **Suggestion:** Add one short line under the error message, e.g. “Use the original file from your camera app (e.g. from the Photos gallery), not a copy from messaging or an edited version.”

### Lower priority

#### 3.9 README and deployment
- **Issue:** README describes the PoC well but doesn’t mention the sample receipt, verification collections, or the re-save (file save more than a few seconds after EXIF capture) rule.
- **Suggestion:** Add one line each: public receipt page and `/v/demo`, “Verify multiple photos” collections, and “Re-save detection (file save more than a few seconds after EXIF capture).” If you use Vercel/Netlify, add a one-line note that SPA routing is configured (so `/verify` and `/v/demo` work on refresh).

#### 3.10 Footer: “Sample receipt” link
- **Issue:** Footer has “Sample receipt” linking to `/v/demo`; that’s good. Ensure the link is visually distinct (e.g. same as other in-page links) and has a clear label for screen readers (e.g. “View sample verification receipt”).

#### 3.11 Performance
- **Issue:** No obvious heavy work; thumbnail generation and EXIF parsing are one-off per upload. Fine for a demo.
- **Suggestion:** If the verified list grows large (e.g. 100+ items), consider virtualizing the list or paginating; not critical for the current demo.

---

## 4. Grant-readiness checklist (reviewer lens)

| Criterion | Status | Note |
|-----------|--------|------|
| Use case alignment | ✅ Strong | Matches “authenticate that an image was captured by a specific camera.” |
| Product vs infrastructure | ✅ Clear | Standalone app, own users, feed, receipts. |
| zkVerify visibility | ✅ Good | Receipt, pipeline, Groth16/zkVerify mentioned in UI and copy. |
| Demo interactivity | ✅ Good | Upload → pass/fail → receipt + feed; sample receipt at `/v/demo`. |
| Reviewer guidance | ✅ Good | Checklist, sample receipt, pipeline visual. |
| Proof volume narrative | ✅ Good | “Verify multiple photos,” collections, repeat use. |
| Limitations stated | ✅ Good | Demo heuristics, production = capture-time attestation. |
| First-time CTA clarity | ⚠️ Improve | Make “Verify a photo” more prominent above the fold (see 3.1). |
| Mobile / a11y | ⚠️ Improve | Touch targets and focus management (see 3.3, 3.7). |

---

## 5. Summary of recommended actions

**Do first (high impact, low effort):**
1. Add a prominent “Verify a photo” CTA in the hero (above the fold).
2. Add “View sample receipt” to the Verified feed empty state.
3. Tweak Verify page so “Choose a photo” appears earlier or is more prominent (e.g. sticky CTA or two-column layout on desktop).

**Do soon (quality and consistency):**
4. Align Verified feed copy with “captured by a real camera, not edited after capture.”
5. After success/error on Verify, move focus to the result or primary button (a11y).
6. Add one line of recovery hint under the failure message.

**Do when convenient:**
7. Update README with sample receipt, collections, and re-save (file save more than a few seconds after EXIF capture).
8. Ensure primary buttons and file input have comfortable touch targets on mobile (e.g. min height 44px, generous padding).

---

## 6. Conclusion

ProofPic is in strong shape for a grant submission: the idea is clear, the demo is functional and reviewer-friendly, and the application structure is documented. The suggested improvements are mostly about **visibility of the main action**, **mobile and accessibility**, and **copy consistency**—not about changing the product or the verification logic. Implementing the high-priority items would further strengthen the first-time and reviewer experience without changing the core message or behavior.
