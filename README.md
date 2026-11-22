# BolKar v2

Fill online forms by speaking in your own language. BolKar is a Chrome side-panel extension plus a working web demo. You check answers and press Submit yourself.

## Features

- Scroll-snapping language dial: 23 recognition languages, 11 with voice output; wheel, touch, tap, and keyboard support.
- Push-to-talk MediaRecorder clips, auto-stopped at 25 seconds. Microphone and playback are mutually exclusive. No browser SpeechRecognition or speechSynthesis.
- Automatic skippable four-step tour, header replay, fictional working example, editable scholarship sample, confirmation and final review.
- Device-local consented profile, typed fallback, validation, transcript/value history, refresh recovery, Reset, and Forget everything.
- Google Forms DOM extraction/verified filling, basic ordinary forms, manual handling for sensitive/gated/upload fields.
- Four server-side Sarvam routes with deterministic mocks, origin checks, request caps, safe errors and best-effort per-IP limits.
- Anonymous voice-versus-typing timing workbench and CSV export, with no invented results.

## Run and test

No dependencies, framework or build step. Node 18+ for logic/proxy checks; Node 22+ for the optional built-in Chrome/CDP browser tests.

```sh
node test/server.mjs
# Open http://127.0.0.1:8080, including local mock API routes
node sync-extension.mjs
node eval/run_eval.mjs
```

A Python static server also works, but does not execute Functions: speech/translation show recovery messages while typing and the example continue. Microphone access needs HTTPS or localhost.

The eval command runs the original 43 authored utterances, rule regressions, language/safety/JSON/profile checks, direct mock handler tests using Request objects, and headless Chrome/Edge checks when installed. Set CHROME_PATH if needed. Browser checks use port 9333 and save ignored screenshots under test/screenshots at 375px and 1280px. Without Chrome, a verification limit is printed and the manual checklist applies. `node eval/flow.mjs` runs browser checks alone.

## Load the Chrome extension

1. Open chrome://extensions, enable Developer mode, and choose Load unpacked.
2. Select this repository’s extension folder. Reload existing form tabs.
3. Click BolKar’s icon. In Voice service settings, enter your deployed BolKar HTTPS website origin; never enter an API key.
4. Choose a language, read the open form, optionally consent to a profile, confirm proposed values, review, and submit on the form yourself.

The package includes byte-identical copies of core modules, speech.js, app.js and base.css. Run `node sync-extension.mjs` after editing shared sources; the included package is ready to load without a build. Tests check for drift. See [the extension checklist](extension/README.md).

## Cloudflare Pages

Framework: None. Build command: `exit 0`. Output directory: `/`. Pages discovers functions/api/sarvam routes. Set environment variables and redeploy:

| Variable | Purpose |
| --- | --- |
| SARVAM_API_KEY | Secret, held only in server environment. Never put it in page/extension code or tracked files. |
| ALLOWED_ORIGINS | Comma-separated web origins. Same origin and chrome-extension:// origins are always allowed. |
| SARVAM_MOCK | Set to 1 to force deterministic offline responses. A missing key also enables mock mode. |

For local live-key testing, use Cloudflare Wrangler: `wrangler pages dev .`, with SARVAM_API_KEY in ignored .dev.vars and SARVAM_MOCK unset. The included test/server.mjs deliberately always mocks and does not read a live key. Verify a short clip, detected language, translation, voice output and structured extraction before using personal details.

Proxy POST contracts: /api/sarvam/stt (multipart file, language_code); /tts (text, language_code, optional speaker); /translate (input, source, target); /chat (messages, optional json). OPTIONS supports CORS preflight; other methods are rejected. Audio cap: 2 MB; TTS: 2500 characters; translation: 2000; chat content: 4000 total. The server never logs audio/transcripts or exposes upstream errors/keys. Limits are best effort per isolate, not global abuse prevention. Public deployments should also use platform controls and provider quotas because extension origins are accepted by design.

## What is real and what is not

Implemented and locally verified: typed demo, tour, example, profile consent/save/delete, persistence, review, sample submission, normalisers, mock proxy contracts, and extraction/filling against a local Google-Forms-like role fixture. Headless Chrome checked the main flow and layouts at 375px and 1280px without JavaScript exceptions. Authored tests are development checks, not user research or speech-accuracy measurements.

**Not yet tested with the live Sarvam API or on a live Google Form:** actual STT, detected language, translation quality, TTS playback, model transliteration/extraction/profile mapping, Chrome side-panel microphone permissions, and live form integration. The extension is implemented but fixture tests do not prove compatibility with Google’s current DOM. Hidden dropdown options, unusual date widgets, multi-page forms and sign-in gates may require manual work. Read each new form page again. Reopening the side panel restores its draft, but changed/reloaded forms must be read again; stored answers alone do not prove a live DOM value.

Mock STT returns a canned transcript for contract testing; the UI refuses to treat it as actual recognition. Mock translation returns the original text; mock chat asks for manual entry. All 23 languages are selectable; languages without voice output use text questions and voice answers when live translation/STT are available. Offline questions visibly fall back to source text. Consent has local text for the 11 voice languages; other languages require live consent translation to save a profile, with a skip path when unavailable. Native-speaker quality review remains necessary.

Profiles and local transcripts are not encrypted. Only a current answer and question go for conversion; profile mapping sends available key names, never the full profile. Live audio, answers and question text reach our proxy and Sarvam, a third party whose processing/retention policies apply. Use typing for private details. Forget everything clears BolKar local storage, not page values already filled or third-party data already processed. Web and extension profiles are separate. No eligibility, identity verification, real scholarship submission, users, success rates or speed improvements are claimed.
