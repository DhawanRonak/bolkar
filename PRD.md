# PRD: BolKar v2

Updated: 23 November 2026

## Problem and promise

Language is a barrier beyond literacy. Applicants in India, families, and helpers should answer in a familiar language while entering values the form expects. Choose a language, speak or type, check, and submit yourself.

## Surfaces and architecture

Chrome Manifest V3 side panel reads Google Forms first and ordinary HTML forms second. It fills only bounded validated fields and never submits or navigates. The buildless web app provides a language dial, functional scholarship sample, fictional example, skippable four-step tour, consent/profile editor, installation instructions, and a separate timing research page with CSV export.

Cloudflare Pages Functions hold the Sarvam secret: saaras:v4/transcribe STT, bulbul:v3/shubh TTS, sarvam-translate:v1 translation, and sarvam-30b chat with temperature zero. Shared UMD modules run in Node and clients; extension copies are synchronised. No Gemini endpoint existed. Deployment remains plain HTML/CSS/JS with build command exit 0.

## Flow

Choose one of 23 languages using the scroll-snapping dial, or record with language_code unknown and confirm detection. Eleven languages have voice output; others show translated text and accept voice answers. Offer consent and optional profile setup on first use. A skipped profile does not block form filling. Saving needs explicit consent in the selected language; when consent translation is unavailable, continue without profile saving.

Read/explain the form. Saved profile values are proposed one at a time for confirmation before filling, then remaining questions are asked. Mapping sends available profile key names and question titles, not a complete profile. Chat proposes structured JSON for transliteration, digit/date conversion and exact-option mapping. Parse defensively, retry once, then use rules or manual entry. Untrusted page text cannot execute actions. Every proposed value passes deterministic validation.

Push-to-talk states: idle, recording with meter, thinking, speaking, error. Tap start/stop; auto-stop at 25 seconds. Recording is disabled during playback. No browser recognition/read-aloud loop. Denied permission, offline services, timeout and mock mode have actionable messages. Typing is always available.

All values require confirmation. Mobile, PIN, DOB, income, email and uncertain values also have spoken read-back where TTS exists. Yes/no vocabulary and explicit buttons support correction. Two failures recommend typing. Keep original transcript and final value in local logs, shown during review. Final review lists all questions and supports edits; sample submission needs review confirmation. External Submit is always pressed by the user.

## Profile, rules and recovery

Device-local fields: full name, DOB, gender, mobile, email, address, city, state, PIN, category, education, annual family income, preferred language. Edit/delete and Forget everything are available. Confirmed answers may prefill the editor but still require saving consent; fictional examples are never silently saved as profiles.

Never store or fill Aadhaar/ID/PAN, bank/IFSC, OTP, password or card details. Skip upload/sign-in-gated fields. Whitelist profile fields. Preserve speech.js digit/mobile/PIN/amount/date/yes-no validators as final authority; add email format validation. Existing scholarship age and annual-income constraints apply. Format validation is not identity or eligibility verification.

Draft, pending answer, profile and local history survive refresh. Reset clears assistant/sample work, keeping the profile. Forget everything also clears settings, tour and research data. Existing external page values remain user-controlled. Re-read changed forms/new form pages rather than replaying stale fields.

## Offline and proxy requirements

Missing key or SARVAM_MOCK=1 gives deterministic mocks. Clients label mock/fallback states and refuse canned STT as real speech. Typing/sample work offline. Translation failure shows source questions. Proxy: allowed-origin CORS, POST/preflight only, bounded audio/text bodies, safe JSON errors, best-effort per-IP limiting, no audio/transcript logging, no client secrets.

## Evaluation and metrics

Run node eval/run_eval.mjs: 43 authored normaliser examples, regressions, language table, direct mock handler Request tests, JSON schemas, validators overriding model outputs, profile safety, role fixture extraction/filling and browser flow where Chrome exists. These are development checks. Future study metrics: correct-value completion, wrong accepted values, correction count, typed fallback rate, detected-language confirmation, and elapsed time including review. The research page collects anonymous timing rounds and CSV; no results are preloaded or claimed.

## Risks and verification gates

Live audio, answer and question text reach Sarvam through our proxy. Explain third-party processing; local profiles/logs are unencrypted; deletion cannot revoke previously processed data. Broad extension host permissions support generic forms and need install disclosure. Google Forms DOM changes, hidden options, date widgets, gates and multi-page layouts can break integration; verify fills and leave manual entry available. Accent/dialect recognition, translation/transliteration, side-panel microphone permissions and real Google Forms require live testing and native-speaker review. Local fixture success is not proof of live compatibility. Rate limiting is isolate-local; public deployments need platform protection.
