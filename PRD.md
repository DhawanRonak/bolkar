# PRD: BolKar — fill a form by speaking

Updated: 22 November 2026

## Problem and audience

For people who are more comfortable speaking than typing, a form can be a barrier. BolKar guides a Hindi, Hinglish or English speaker through preparing six scholarship-form details. Helpers can use the same flow alongside the applicant.

## Promise and scope

Answer one question, check what was heard, then save it. The current product prepares a local form; it does not submit applications or check eligibility. There is no AI dependency or server API.

## Principles

1. Recognise, normalise, validate, confirm. Every answer requires confirmation, including names and gender.
2. Reject unsupported input rather than silently dropping unknown number words.
3. Keep typing available throughout the guided questions.
4. Keep personal details local to this browser, with clear disclosure that the browser speech provider may process audio remotely.
5. Preserve unfinished work, and provide a clear reset.

## Flow

1. A skippable five-step tour opens on the first visit; completion or skipping is remembered in localStorage. “How it works” reopens it.
2. Select English or Hindi/Hinglish. Field questions and read-back use that language; controls remain in English.
3. Speak using the microphone or type the answer. Listening, no-speech and permission errors have visible states. Chrome over HTTPS or localhost with microphone permission is required for voice; typing remains usable.
4. Show the transcript, validated value and any monthly-to-yearly conversion. Read back every valid answer. Confirm using the button or yes/haan; reject with Change answer or no/nahi. A replacement can also be typed.
5. Confirmed answers populate an editable summary. Pending confirmation, input, chosen language, saved status and confirmed details survive refresh.
6. Review all six details, save to this device and optionally download a text copy. Editing reopens the field and requires confirmation again. Reset asks before clearing local work.
7. “Try an example” loads fictional details with income pending, enabling confirmation and final review without typing. It replaces the current draft.

## Rules

Fields: full name, date of birth, gender, mobile number, postal PIN and yearly family income. Mobile: 10 digits starting 6–9, with optional country prefix or leading zero. PIN: six digits starting 1–9. Dates must exist and give age 5–100. Amounts must be positive and within ₹1,000–₹5 crore annually; explicit monthly amounts are multiplied by 12. Supports selected English and Hindi number words, Devanagari digits, double/triple, lakh/hazaar/crore and common fractional expressions. Vocabulary is limited; this is validation of format, not identity or real-world assignment.

## Current requirements

P0: voice and typed entry; per-field question; validation and actionable errors; explicit confirmation; final review; local persistence; reset; example; guided tour; mobile accessibility.

The former participant timing dashboard, plain-typing research mode and CSV research export are removed to focus the product on form completion. Research comparison can be conducted separately; no participant outcomes are asserted.

## Evaluation and future research

Run `node eval/run_eval.mjs` and `node eval/flow.mjs`. The 43 author-written utterances plus regression cases are development checks, not user research. Future research should test whether voice reduces effort, which read-back errors people catch, and where typing feels more private or reliable. Broader vocabulary, additional languages and integration with actual forms are future scope.

## Risks

Speech recognition varies by accent and noise: mitigate with visible transcript, confirmation and typing. People can confirm errors without checking: make the value prominent and allow edits. LocalStorage is device-local but not encrypted: disclose storage near the form, support download and reset, and avoid collecting server-side data.
