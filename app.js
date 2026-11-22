/* Browser controller. Validation lives in speech.js and remains runnable in Node. */
'use strict';
const B = window.BolKar, F = B.FIELDS, $ = id => document.getElementById(id);
const KEY = 'bolkar_form_v2';
let persistent = true;
function readStore(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function writeStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { persistent = false; } }
const fresh = () => ({ lang: 'en', values: {}, i: 0, pending: null, draft: '', saved: false, sample: false });
let state = readStore(KEY) || fresh();
if (!state.values || typeof state.values !== 'object' || Array.isArray(state.values) || !Number.isInteger(state.i) || state.i < 0 || state.i > F.length) state = fresh();
state.lang = state.lang === 'hi' ? 'hi' : 'en';
// Treat browser storage as untrusted. Re-validate restored values before displaying them.
for (const f of F) if (state.values[f.id] !== undefined && !B.parse(f, String(state.values[f.id])).ok) delete state.values[f.id];
if (state.pending && (state.i >= F.length || !B.parse(F[state.i], String(state.pending.value)).ok)) state.pending = null;
if (state.i === F.length && F.some(f => state.values[f.id] === undefined)) { state.i = F.findIndex(f => state.values[f.id] === undefined); state.saved = false; }
let recognition = null, listening = false, epoch = 0;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceAvailable = SR && window.isSecureContext;
const hints = ['Use the name you would put on your application.', 'Day, month, year. For example, 5 March 2005.', 'Say female, male or other.', 'Say all 10 digits, one at a time.', 'Your area’s six-digit postal PIN code.', 'Say a yearly amount, or include “per month”.'];
function persist() { writeStore(KEY, state); $('storage').textContent = persistent ? (state.saved ? 'Saved on this device' : 'Draft kept on this device') : 'Browser storage unavailable — download before leaving'; }
function stop() { epoch++; if (recognition) { recognition.abort(); recognition = null; } listening = false; if (window.speechSynthesis) speechSynthesis.cancel(); }
function speak(text) { if (!window.speechSynthesis) { $('feedback').textContent = 'Read-aloud is unavailable in this browser. Your answer is shown on screen.'; return; } speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = state.lang === 'hi' ? 'hi-IN' : 'en-IN'; u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') $('feedback').textContent = 'Read-aloud is unavailable right now. Please check the text on screen.'; }; speechSynthesis.speak(u); }
function display(f, value) { return B.readBack(f, String(value), state.lang).shown; }
function render() {
  const done = state.i === F.length, f = F[state.i];
  $('language').value = state.lang;
  $('step').textContent = done ? (state.saved ? 'FORM SAVED' : 'FINAL REVIEW') : `QUESTION ${state.i + 1} OF ${F.length}`;
  const count = F.filter(f => state.values[f.id] !== undefined).length;
  $('count').textContent = `${count} / 6`; $('progress').style.width = `${count / 6 * 100}%`;
  $('interaction').hidden = done; $('completion').hidden = !done;
  $('voiceState').textContent = listening ? 'Listening… tap to stop' : state.pending ? 'Answer heard — please confirm' : 'Tap to speak';
  $('mic').classList.toggle('listening', listening); $('mic').setAttribute('aria-label', listening ? 'Stop listening' : 'Start microphone');
  $('micNote').textContent = voiceAvailable ? 'One answer at a time. You can always type below.' : 'Voice needs Chrome over HTTPS (or localhost) and microphone permission. You can type every answer below.';
  $('mic').disabled = !voiceAvailable;
  if (!done) {
    $('question').textContent = f[state.lang]; $('question').lang = state.lang;
    $('hint').textContent = hints[state.i]; $('typed').value = state.draft || '';
    $('typed').placeholder = ['e.g. Sunita Devi','e.g. 5 March 2005','e.g. Female','e.g. 9876543210','e.g. 282001','e.g. dedh lakh'][state.i];
    $('confirmation').hidden = !state.pending;
    $('heard').textContent = state.pending ? display(f, state.pending.value) : '';
    $('normalNote').textContent = state.pending ? `${state.pending.note || ''}${state.pending.note ? '. ' : ''}Does this look right? Confirm here or say yes / haan.` : '';
    $('send').textContent = state.pending ? 'Check replacement →' : 'Check answer →';
  }
  $('details').replaceChildren();
  F.forEach((f, i) => { const row = document.createElement('div'); row.className = 'detail'; const dt = document.createElement('dt'); dt.textContent = f.label; const dd = document.createElement('dd'); const value = state.values[f.id]; dd.textContent = value === undefined ? 'Not answered yet' : display(f, value); if (value === undefined) dd.className = 'empty'; row.append(dt, dd); if (value !== undefined) { const edit = document.createElement('button'); edit.textContent = 'Edit'; edit.setAttribute('aria-label', `Edit ${f.label}`); edit.onclick = () => { stop(); state.i = i; state.pending = null; state.draft = String(value); state.saved = false; $('feedback').textContent = ''; persist(); render(); $('typed').focus(); }; row.append(edit); } $('details').append(row); });
  $('completeTitle').textContent = state.saved ? 'Your form is saved.' : 'Ready for a final look.';
  $('completeNote').textContent = state.saved ? 'Your details are saved in this browser. Download a copy to keep or use when applying.' : 'Check each detail below or alongside. Edit any answer before saving.';
  $('save').hidden = state.saved; $('download').hidden = !state.saved;
  $('example').textContent = state.sample ? 'Reload example →' : 'Try an example →';
  persist();
}
function receive(text) {
  if (state.i >= F.length) return;
  if (!text.trim()) { $('feedback').textContent = 'Please speak or type an answer first.'; return; }
  if (state.pending) { const yn = B.yesNo(text); if (yn === 'yes') { confirmAnswer(); return; } if (yn === 'no') { changeAnswer(); return; } }
  const r = B.parse(F[state.i], text);
  state.draft = text; state.saved = false;
  if (!r.ok) { state.pending = null; render(); $('feedback').textContent = `${r.why}. Please try again or type the answer.`; return; }
  state.pending = {value:r.value, note:r.note || '', transcript:text}; state.draft = ''; $('feedback').textContent = `Heard: ${text}`; render(); speak(B.readBack(F[state.i], r.value, state.lang).speak); $('confirm').focus();
}
function confirmAnswer() { if (!state.pending) return; stop(); state.values[F[state.i].id] = state.pending.value; state.pending = null; state.draft = ''; state.i = F.findIndex(f => state.values[f.id] === undefined); if (state.i === -1) state.i = F.length; $('feedback').textContent = ''; render(); if (state.i < F.length) { $('typed').focus(); speak(F[state.i][state.lang]); } else $('completeTitle').focus(); }
function changeAnswer() { stop(); state.pending = null; state.draft = ''; $('feedback').textContent = 'Let’s try that answer again.'; render(); $('typed').focus(); }
$('answerForm').onsubmit = e => { e.preventDefault(); stop(); receive($('typed').value); };
$('typed').oninput = () => { state.draft = $('typed').value; persist(); };
$('confirm').onclick = confirmAnswer; $('change').onclick = changeAnswer;
$('read').onclick = () => { if (state.pending) speak(B.readBack(F[state.i], state.pending.value, state.lang).speak); };
$('repeat').onclick = () => speak(F[state.i][state.lang]);
$('language').onchange = () => { stop(); state.lang = $('language').value; render(); };
$('mic').onclick = () => {
  if (listening && recognition) { recognition.stop(); return; }
  if (!voiceAvailable || state.i === F.length) { $('typed').focus(); return; }
  stop(); const token = epoch; let received = false, failed = false;
  try {
    const rec = recognition = new SR(); rec.lang = state.lang === 'hi' ? 'hi-IN' : 'en-IN'; rec.interimResults = false;
    rec.onstart = () => { if (token !== epoch) return; listening = true; $('feedback').textContent = ''; render(); };
    rec.onresult = e => { if (token !== epoch) return; received = true; listening = false; receive(e.results[0][0].transcript); };
    rec.onerror = e => { if (token !== epoch) return; failed = true; listening = false; render(); $('feedback').textContent = ['not-allowed','service-not-allowed','audio-capture'].includes(e.error) ? 'We couldn’t use your microphone. Allow microphone access in Chrome’s site settings over HTTPS, or type below.' : 'We couldn’t hear an answer. Try again in a quieter place, or type below.'; };
    rec.onend = () => { if (token !== epoch) return; listening = false; recognition = null; render(); if (!received && !failed) $('feedback').textContent = 'No answer heard. Tap the microphone to try again, or type below.'; };
    rec.start();
  } catch { listening = false; render(); $('feedback').textContent = 'Voice could not start. Try Chrome over HTTPS with microphone permission, or type below.'; }
};
$('example').onclick = () => { stop(); state = fresh(); state.lang = $('language').value; state.sample = true; state.values = {name:'Sunita Devi',dob:'05-03-2005',gender:'Female',mobile:'9876543210',pin:'282001'}; state.i = 5; state.pending = {value:150000,note:'Example: “dedh lakh” becomes a yearly amount',transcript:'dedh lakh'}; $('feedback').textContent = 'Example loaded. These are fictional details. Confirm the income to try the final review.'; render(); $('question').scrollIntoView({behavior:'smooth',block:'center'}); };
$('save').onclick = () => { if (F.some(f => state.values[f.id] === undefined)) return; state.saved = true; render(); };
$('download').onclick = () => { const data = F.map(f => `${f.label}: ${display(f,state.values[f.id])}`).join('\n'); const url = URL.createObjectURL(new Blob([`BolKar — saved details\n${state.sample ? 'Fictional example\n' : ''}\n${data}\n`],{type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href = url; a.download = 'bolkar-details.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); };
$('reset').onclick = () => { stop(); render(); $('resetDialog').showModal(); };
$('cancelReset').onclick = () => $('resetDialog').close();
$('doReset').onclick = () => { state = fresh(); try { localStorage.removeItem('bolkar_runs'); } catch {} $('resetDialog').close(); $('feedback').textContent = ''; render(); $('typed').focus(); };
const steps = [ ['language','Choose your language','Use English, Hindi or Hinglish. The question and spoken guidance follow your selection.'],['voiceArea','One question. One answer.','Tap the big microphone and speak naturally. The button tells you when it is listening.'],['answerForm','Typing is always here','No microphone? Type an answer instead. Every answer is checked and read back before you confirm it.'],['exampleArea','Try a ready-made example','Load fictional details and confirm the final answer to see a complete form without typing.'],['summary','Check, edit, then save','Watch your details fill in here. Edit any answer, review the whole form, then save or download it.'] ];
let tourIndex = 0, highlight = null;
function tourRender() { if (highlight) highlight.classList.remove('tour-highlight'); const [id,title,txt] = steps[tourIndex]; highlight = $((state.i === F.length && ['voiceArea','answerForm'].includes(id)) ? 'completion' : id); highlight.classList.add('tour-highlight'); highlight.scrollIntoView({block:'center',behavior:'instant'}); $('tourCount').textContent = `QUICK TOUR · ${tourIndex + 1} / ${steps.length}`; $('tourTitle').textContent = title; $('tourText').textContent = txt; $('back').disabled = tourIndex === 0; $('next').textContent = tourIndex === steps.length-1 ? 'Let’s begin' : 'Next →'; }
function closeTour() { if (highlight) highlight.classList.remove('tour-highlight'); writeStore('bolkar_tour_v2',true); $('tour').close(); $('how').focus(); }
function openTour() { stop(); render(); tourIndex = 0; $('tour').showModal(); tourRender(); }
$('how').onclick = openTour; $('skip').onclick = closeTour; $('tour').oncancel = e => { e.preventDefault(); closeTour(); }; $('back').onclick = () => { tourIndex--; tourRender(); }; $('next').onclick = () => { if (++tourIndex >= steps.length) closeTour(); else tourRender(); };
render(); if (!readStore('bolkar_tour_v2')) openTour();

