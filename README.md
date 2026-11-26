# IT lab 1: classroom learning pilot

Prepared 25 November 2026; publishing package updated 26 November 2026. Intended address: https://enache101.github.io/it-lab-1/. This is an independent learning pilot. No hosting purchase or custom-domain DNS change is included.

Serve this directory over HTTPS, or localhost for development. All paths are relative so a GitHub Pages project subpath is supported. No build system or third-party runtime dependency is required. The `.nojekyll` file prevents Jekyll processing.

Included: original practice questions and true/false questions, shuffled 60-minute sessions, answer feedback, flashcards, local backup/restore, local plain-text assignment checks, timetable, deadlines, themes, text size, device speech and an offline shell. Scoring and self-rated recall are practice measures, not validated exam-readiness scores. Sessions do not resume after browser closure. Drafts and past results save locally, subject to browser storage availability.

Deliberately excluded from the public distribution: class roster, student IDs, private register downloads, membership forms, personal owner planning, official PRINCE2 sample paper questions, uploaded homework, credentials and the old private source history.

## Remaining release requirements

- Browser/mobile/offline QA is still required. Static checks are not a substitute for Safari/iOS and Chrome/Android testing.
- Set `bookingURL` in config.js to a working presentation calendar with 15-minute slots. Test simultaneous booking, group identification, cancellation and lecturer approval. Until then, the booking button stays hidden and the section says not connected.
- Set `protectedRegisterURL` to a genuinely access-controlled, view-only register. Do not use an anyone-with-link share for student IDs. No register link is configured yet.
- Upload only this clean distribution, never the private source repository or its history.
- Verify the Pages destination after deployment. Do not switch itlab.florinenache.com before the replacement is verified.
- The included QR points to the GitHub Pages address. Verify that address and a fresh scan after publication. Older QR images for the custom domain still target the earlier private deployment.
- Select or create a GitHub repository with publishing restricted to Florin. This package uses the dedicated Enache101/it-lab-1 repository.
- Review content and hosting terms before commercialisation. The product is not ready to sell. The saved Now and Future roadmap contains the longer-term scope.

## Assignment checker limits

Supports plain-text files and pasted text only. Word/PDF content must be copied by the student. Checks approximate whitespace-separated word count and presence of student-entered headings/phrases. It does not assess argument quality, source credibility, formatting, reference validity, plagiarism or a likely grade. It does not send text to an AI service. Main text and checklist save on the browser and may be visible to others on the same device.

## Data attribution

Timetable and assignment deadline/link data were supplied by Florin from the university portal. Links require the institution's own access permissions. Questions are the separately authored scenario bank from the existing IT lab 1 source, plus original entry-level statements; official sample-paper banks are excluded. Institutional and PRINCE2 affiliation or endorsement is not claimed.
