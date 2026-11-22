# BolKar Chrome extension

Run node sync-extension.mjs from the repository root after shared-code edits. Included files are ready to load without a build.

1. Open chrome://extensions and enable Developer mode.
2. Choose Load unpacked and select this extension folder.
3. Reload existing form tabs, click BolKar, and enter your deployed HTTPS BolKar site origin in Voice service settings. Never enter a key here.
4. Choose a language, read the form, optionally consent to profile saving, and check each proposed value before filling.
5. Review, complete manual fields yourself, then press Submit on the original website yourself.

Permissions: sidePanel opens the assistant; storage keeps device-local profile/draft/cache; activeTab/tabs identify the form; HTTPS host permissions support Google Forms, basic generic forms and your proxy. Reading is initiated by the user. Web and extension storage are separate. Settings contain only a URL, not a key.

## Manual live checklist

**Still needs testing on a real Google Form and with the live Sarvam API.** Automated browser checks use a role fixture and mock server, not an unpacked-extension session.

- Load unpacked, inspect service-worker/side-panel consoles, and compare extracted titles/help/required/options to a real test-owned Google Form using fictional details.
- Test short text, paragraph, radio, checkbox selection/deselection, dropdown, date, time and scale. Verify page values persist after events. Hidden dropdown options and unusual widgets may need manual input.
- Include upload, sign-in, Aadhaar/PAN/ID, bank/IFSC, OTP/password/card questions. Confirm they are skipped, not sent for conversion, and never filled.
- Re-read after changing form pages or reloading. Verify stale references produce an error and never a claimed fill. The extension never auto-submits or navigates.
- Configure a real server key with mocks off. Test STT (saaras:v4/transcribe), unknown-language detection, translation (sarvam-translate:v1), TTS (bulbul:v3/shubh) and structured chat (sarvam-30b, temperature zero). No key should appear in client source or network headers.
- With native speakers, check Hindi/English and a language without TTS. Check Latin-script names, exact options, numeric/date conversion, accents and dialects before claiming accuracy.
- Allow/deny the actual side-panel microphone prompt. Check level meter, tap start/stop, 25-second cutoff, and disabled recording during playback. Assistant audio must never trigger recognition.
- Test risky read-back, spoken and button yes/no, ambiguous confirmation, two failures, typed fallback, review/edit, and manual Submit.
- Consent/save/reuse profile, close/reopen panel, restore pending draft, edit/delete profile and Forget everything. External page values already filled remain on the page.
- Disconnect network, remove key, force mocks, deny CORS, exceed limits and return malformed chat JSON. Typed/manual filling must remain available and mock STT must never become an actual answer.
- Test keyboard-only controls, narrow side panel, first-run tour/replay and proxy URL validation.

Run node eval/run_eval.mjs from the repository root for normaliser, safety, proxy and local browser/fixture checks. Live extension lifecycle, provider accuracy and Google integration remain separate manual checks.
