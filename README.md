# BolKar

**Fill a form by speaking in Hindi, Hinglish or English.**

> Independent concept prototype for a product-management case study. Not affiliated with any company; all data is made up.

**Live demo:** _add your Vercel link here after deploying_  
**Product spec:** [PRD.md](PRD.md)

## The problem

Forms assume people can read English labels and type. BolKar asks each field aloud in the person's language, turns how people actually say numbers ("dedh lakh", "double nine", "paanch march do hazaar paanch") into clean values, rejects rather than guesses, and reads risky values back before saving.

## What the prototype does

- Per-field questions on screen and aloud, in Hindi or English; speech or typed input.
- Normaliser for mobile numbers, PIN codes, amounts, dates, names and gender in three languages.
- Read-back for risky fields only, with yes/no understood in three languages.
- Research mode: a timed voice-guided run against a plain typing run of the same form, with CSV export.

## Run it

No build step and no dependencies. Open `index.html` in a browser, or serve the folder over https for the microphone.

Tests need Node 18 or later:

```
node eval/run_eval.mjs
```

## Deploy

1. On [vercel.com](https://vercel.com), choose **Add New → Project** and import this repository.
2. Framework preset **Other**, no build command, no root directory. Deploy.

Then paste the live link at the top of this README.

## Files

| File | What it is |
|---|---|
| `speech.js` | The normaliser and validators (pure functions) |
| `index.html` | The prototype |
| `eval/run_eval.mjs` | Scores the normaliser |
| `eval/utterances.js` | 43 spoken-style test inputs |
| `PRD.md` | Product requirements: problem, hypotheses, requirements, metrics, evaluation plan, risks |
| `base.css` | Shared styles |

## What is real and what is not

- Speech recognition uses the browser's built-in engine: it needs Chrome and an https page. Typing works everywhere.
- The 43 test inputs were written by the author, and two rules were fixed after the first run, so the score (40 right, 0 wrong values accepted) is a development score. Re-score on real transcripts.

## Author

Ronak Dhawan · product management portfolio
