# Release candidate verification, 25 November 2026

Passed: JavaScript syntax; unique IDs and static control targets; question IDs and answer bounds; public distribution scan for supplied student IDs.

Chrome desktop UI passed: shuffled entry true/false session, running timer, red incorrect feedback with explanation, local text word count and required-phrase presence checks, draft and checklist persistence after reload, flashcard reveal and confidence progress.

Chrome 390×844 viewport passed: cached app reload and flashcards with network disabled. Network and viewport overrides were reset afterwards. This is an emulated viewport, not a real iPhone or Android device test.

Not verified: actual 60-minute expiry, backup/restore round trip, screen reader and device speech, real iOS Safari/Android installation, shared bookings and protected register access. Booking and register destinations remain unconfigured and explicitly unavailable in the UI.

Candidate only. No GitHub publication, DNS migration or payment performed.
