# PRD: BolKar — fill a form by speaking

Author: Ronak Dhawan · Status: concept, pre-research · Last updated: 16 Nov 2026
Product area this maps to: browser and phone assistants (for example autofill and Gemini in Chrome or Android). Independent concept, fictional form, no company branding.

## 1. Problem
Scholarships, job applications, bank and exam forms are the gate to most services, and they assume the person can read English labels and type. Many first-generation smartphone users cannot do both comfortably, so they pay a cyber-café operator or wait for a relative. Speaking is the skill they already have.

AI assistants can now fill forms: Gemini in Chrome reached India in 2026 with form filling among its actions and support for Hindi and other Indian languages. That is built for a confident user who types a request and supervises. Research groups have shown the other half works: a voice agent called FormBharo pairs a language model with fixed validation rules to fill forms over a phone call for Hindi-speaking mothers.

The gap is a consumer product for the person filling their own form: it asks one field at a time, aloud, in their language; understands how people actually say numbers ("dedh lakh", "double nine"); and never saves a risky value without reading it back.

Sources: https://www.tech2.com/ai/gemini-now-works-in-chrome-for-users-in-india-heres-how-you-can-use-it-text-ws-l-10157433.html · https://www.91mobiles.com/hub/google-gemini-in-chrome-rolled-out-india-hindi-more-languages/amp/ · https://prismix.dev/news/155c8241751e

## 2. Who it is for
- Primary: someone who speaks Hindi or Hinglish, uses voice notes daily, and avoids forms.
- Secondary: the helper who fills forms for others and wants fewer mistakes.

## 3. Hypotheses (to be tested)
- H1. For this user, speaking a six-field form is faster than typing it and produces fewer invalid fields.
- H2. The costly errors are in numbers (mobile, PIN, income, dates), not names.
- H3. Reading a value back catches most recognition errors, and people accept it for a few fields but not for every field.
- H4. After two failed attempts on a field, people want to type or get help, not try a third time.

## 4. Principles
1. **Recognise, normalise, validate, confirm.** Speech-to-text gives words; fixed rules turn them into a value and check it; only then is it saved.
2. **Reject before guessing.** A rejection costs one repeat. A wrong accepted value can cost the application.
3. **Read back only what is risky.** Mobile, PIN, date of birth and income are read back; name and gender are not.
4. **Typing is always available.** Voice is an aid, never a trap.

## 5. Flow
1. The assistant asks the field's question in the chosen language, on screen and aloud.
2. The person speaks (or types). The transcript is shown.
3. The value is normalised and validated. If invalid, the reason is shown in plain words and the question repeats. After two failures it offers typing.
4. For risky fields, the value is shown large and read back; "haan / sahi / yes" saves it, "nahi / galat / no" asks again.
5. The form fills in visibly, field by field.

## 6. What the normaliser handles (in `speech.js`)
- Digits spoken in English, romanised Hindi or Devanagari, with "double" and "triple"; strips +91 and a leading 0.
- Amounts: lakh, hazaar, crore; dedh, dhai, sava, sadhe, paune; "per month" converted to a yearly figure, with a note shown.
- Dates: "5 March 2005", "05/03/2005", "paanch march do hazaar paanch"; rejects impossible dates and ages outside 5–100.
- Yes/no in three languages.
Known gaps: compound Hindi number words (for example अट्ठानवे, अस्सी) and years said as "unnis sau…". These are rejected, not guessed.

## 7. Requirements
P0: per-field question in Hindi and English, on screen and aloud; speech and typed input; normalise, validate, plain-language rejection; read-back for risky fields; visible form filling; log of what was heard.
P1: works on any web form by reading its labels; more languages; "repeat the question" and "go back" by voice.
P2: remembers safe details for next time with consent; hands off to a human helper.

## 8. Success metrics
- North star: forms completed without help, per user per month.
- Quality: invalid or wrong fields per submitted form. Target lower than typing.
- Guardrail: wrong values accepted without read-back. Target zero for risky fields.
- Effort: attempts per field; share of fields that fell back to typing; drop-off per field.

## 9. Evaluation (in `eval/` and in the prototype)
- **Normaliser eval.** 43 spoken-style inputs across field types and three languages. Current result: 40 right, 0 wrong values accepted, 3 wrongly rejected (the known gaps above). Caveat: the author wrote these inputs and fixed two rules after the first run, so this is a development score, not a test score.
- **Voice vs typing.** The prototype times a voice-guided run and a plain typing run of the same form and records attempts, rejections, corrections after read-back and invalid fields, with CSV export. 5–8 participants, alternating order.
- **Next step.** Copy real transcripts from the log into the eval set and re-score.

## 10. Risks
- Speech recognition quality for accents and noisy rooms. Mitigation: read-back, typed fallback, measure by field.
- Privacy when speaking personal details aloud in public. Mitigation: prompt to use earphones; typed fallback; nothing stored.
- Over-trust: people say "haan" without listening. Mitigation: show the value large; measure time-to-confirm.
- Browser support: speech recognition needs a supporting browser and an https page.

## 11. Research script (15 minutes)
1. When did you last fill a form on your phone? Who helped?
2. (Voice run, then typing run, or the reverse.) Which felt easier? Which do you trust more?
3. Was any read-back annoying? Was there a field you wished it had read back?
4. Where would you not want to say these details aloud?
