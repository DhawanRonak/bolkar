# BolKar

Fill a six-field scholarship preparation form by speaking Hindi, Hinglish or English, or by typing. Check every answer before it is added, review the whole form, and save a local copy.

## Features

- Language selector, microphone listening state, permission and browser guidance, and always-visible typing fallback.
- Fixed rules for names, dates, gender, Indian mobile numbers, postal PIN codes and yearly family income. Monthly income is converted with a visible note.
- Read-back and explicit confirmation for every field; editable summary and final save.
- Automatic five-step tour, Skip, and header “How it works” to reopen it.
- “Try an example” loads fictional details and a pending income answer, so the visitor can confirm, review and save immediately.
- Local draft recovery, including unfinished typing and pending confirmation; reset and text download. Storage failures are reported.
- Responsive layout, keyboard focus indicators, labelled controls and reduced-motion support.

## Run

No dependencies or build step. From this directory:

```sh
python -m http.server 8080
```

Open http://localhost:8080. Use Chrome with microphone permission. Deployed voice recognition requires HTTPS; localhost is also a secure context. Typing works without speech recognition or an AI service.

## Test

Node 18+:

```sh
node eval/run_eval.mjs
node eval/flow.mjs
```

The first command scores 43 author-written utterances and runs additional rule regressions. It exits unsuccessfully on a mismatch. These are development checks, not evidence of real-world recognition accuracy. The second exercises the browser controller with a small DOM test harness.

## Deploy on Cloudflare Pages

Connect this repository in Cloudflare Pages. Choose framework **None**, build command `exit 0`, and output directory `/`. Deploy and use the generated HTTPS address. There are no API keys, environment variables, external fonts or runtime dependencies.

## What is real and what is not

Browser speech recognition and read-aloud, deterministic validation, local save, download, editing and draft recovery are implemented. Speech availability and recognition quality depend on the browser, network and microphone; the browser speech provider may process audio remotely. BolKar itself has no server or AI endpoint and makes no application submission.

The scholarship form and example are for preparing details. They do not connect to a scholarship provider, verify identity, establish eligibility, validate whether a phone/PIN is assigned, or submit an application. Saved data remains in this browser’s localStorage, which is not encrypted and can be cleared by the browser. Reset clears the form and legacy research runs. No users or measured product outcomes are claimed.

The rules cover a limited vocabulary, including digit words, double/triple, common lakh/hazaar expressions and selected Hindi compound numbers. Unsupported expressions should be rephrased or typed; always check read-back. The interface controls are in English; field questions and spoken read-back also support Hindi.

## Files

- `index.html`, `base.css`: interface and responsive styles.
- `app.js`: speech lifecycle, form state, persistence, walkthrough and download.
- `speech.js`: pure browser/CommonJS normalisers and validators.
- `eval/`: utterance evaluation, rule regressions and controller flow checks.
- `PRD.md`: scope, principles and research hypotheses.

## Verification limits

Local HTTP serving and Node checks were run. Installed headless Chrome could not start its GPU process in this environment, so real browser clicks, microphone permissions and visual inspection at 375px and 1280px remain manual checks.
