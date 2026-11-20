// BolKar: turns what a person SAYS into a clean, validated form value. Pure functions.
// The speech recogniser gives text; these rules normalise it, validate it, and decide
// whether to read it back. Works in the browser (window.BolKar) and in Node (require).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BolKar = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const DIG = { zero: 0, shunya: 0, 'शून्य': 0, 'जीरो': 0, 'ज़ीरो': 0, ek: 1, one: 1, 'एक': 1, do: 2, two: 2, 'दो': 2, teen: 3, three: 3, 'तीन': 3,
    char: 4, chaar: 4, four: 4, 'चार': 4, paanch: 5, panch: 5, five: 5, 'पांच': 5, 'पाँच': 5, chhe: 6, chhah: 6, cheh: 6, six: 6, 'छह': 6, 'छः': 6, 'छे': 6,
    saat: 7, seven: 7, 'सात': 7, aath: 8, eight: 8, 'आठ': 8, nau: 9, nine: 9, 'नौ': 9 };
  const NUM = Object.assign({ das: 10, ten: 10, 'दस': 10, barah: 12, 'बारह': 12, pandrah: 15, 'पंद्रह': 15, bees: 20, twenty: 20, 'बीस': 20, pachees: 25, 'पच्चीस': 25,
    tees: 30, thirty: 30, 'तीस': 30, chalis: 40, 'चालीस': 40, pachas: 50, fifty: 50, 'पचास': 50, sau: 100 }, DIG);
  const FRAC = { dedh: 1.5, 'डेढ़': 1.5, dhai: 2.5, 'ढाई': 2.5, sava: 1.25, 'सवा': 1.25 };
  const UNIT = { lakh: 1e5, lac: 1e5, lakhs: 1e5, 'लाख': 1e5, hazaar: 1e3, hazar: 1e3, thousand: 1e3, 'हज़ार': 1e3, 'हजार': 1e3, crore: 1e7, 'करोड़': 1e7 };
  const MONTH = {}; [['january', 'jan', 'janvari', 'जनवरी'], ['february', 'feb', 'farvari', 'फरवरी', 'फ़रवरी'], ['march', 'मार्च'], ['april', 'apr', 'अप्रैल'], ['may', 'mai', 'मई'], ['june', 'jun', 'जून'],
    ['july', 'jul', 'julai', 'जुलाई'], ['august', 'aug', 'agast', 'अगस्त'], ['september', 'sep', 'sitambar', 'सितंबर', 'सितम्बर'], ['october', 'oct', 'aktubar', 'अक्टूबर'],
    ['november', 'nov', 'navambar', 'नवंबर', 'नवम्बर'], ['december', 'dec', 'disambar', 'दिसंबर', 'दिसम्बर']].forEach((names, i) => names.forEach(n => MONTH[n] = i + 1));
  const toks = s => String(s).toLowerCase().replace(/(\d)\.(\d)/g, '$1$2').replace(/[,.;:!?।"'()]/g, ' ').replace(//g, '.').replace(/(\d)\s*[-\/]\s*(\d)/g, '$1/$2').split(/\s+/).filter(Boolean);

  // "nine eight double seven..." -> "98877..."
  function digits(text) {
    const t = toks(text.replace(/\//g, ' ')); let out = '', rep = 1;
    for (const w of t) {
      if (w === 'double' || w === 'डबल') { rep = 2; continue; }
      if (w === 'triple' || w === 'ट्रिपल') { rep = 3; continue; }
      let d = null; if (/^\d+$/.test(w)) d = w; else if (w in DIG) d = String(DIG[w]);
      if (d !== null) { out += d.length === 1 ? d.repeat(rep) : d; }
      rep = 1;
    }
    return out;
  }
  function mobile(text) { let d = digits(text); if (d.length === 12 && d.startsWith('91')) d = d.slice(2); if (d.length === 11 && d[0] === '0') d = d.slice(1);
    return /^[6-9]\d{9}$/.test(d) ? { ok: true, value: d } : { ok: false, why: d.length ? `Heard ${d.length} digits; a mobile number has 10 and starts with 6 to 9` : 'No digits heard' }; }
  function pin(text) { const d = digits(text); return /^[1-9]\d{5}$/.test(d) ? { ok: true, value: d } : { ok: false, why: d.length ? `Heard ${d.length} digits; a PIN code has 6` : 'No digits heard' }; }
  // "dedh lakh", "1 lakh 20 hazaar", "sadhe teen lakh", "12000 mahine ka" -> rupees per year
  function amount(text) {
    const t = toks(text); let total = 0, cur = null, half = false, found = false, prevKnown = true, unsure = false;
    for (const w of t) {
      const known = /^\d+(\.\d+)?$/.test(w) || w in FRAC || w in NUM || w in UNIT || ['sadhe', 'साढ़े', 'paune', 'पौने'].includes(w);
      if (w in UNIT && cur === null && !prevKnown) unsure = true; // a number word we do not know came right before "lakh"/"hazaar"
      prevKnown = known;
      if (w === 'paune' || w === 'पौने') { half = -0.25; continue; }
      if (w === 'sadhe' || w === 'साढ़े') { half = 0.5; continue; }
      if (/^\d+(\.\d+)?$/.test(w)) { if (cur !== null) total += cur; cur = Number(w) + (half || 0); half = false; found = true; continue; }
      if (w in FRAC) { if (cur !== null) total += cur; cur = FRAC[w]; found = true; continue; }
      if (w in NUM) { if (cur !== null && cur < 100 && NUM[w] < 10 && cur % 10 === 0 && cur >= 20) cur += NUM[w]; else { if (cur !== null) total += cur; cur = NUM[w] + (half || 0); } half = false; found = true; continue; }
      if (w in UNIT) { total += (cur === null ? 1 : cur) * UNIT[w]; cur = null; found = true; continue; }
    }
    if (cur !== null) total += cur;
    if (!found || total <= 0) return { ok: false, why: 'No amount heard' };
    if (unsure) return { ok: false, why: 'Could not make out the number. Please say it again or type it' };
    const monthly = /per month|a month|monthly|mahine|mahina|महीने|महीना|माह/.test(text.toLowerCase());
    const value = Math.round(total * (monthly ? 12 : 1));
    return value >= 1000 && value <= 5e7 ? { ok: true, value, note: monthly ? 'monthly figure converted to yearly' : '' } : { ok: false, why: `Heard ₹${value}; that looks too ${value < 1000 ? 'small' : 'large'} for a yearly income` };
  }
  // "5 march 2005", "5/3/2005", "paanch march do hazaar paanch"
  function date(text) {
    const t = toks(text); let d = null, m = null, y = null;
    const slash = t.find(w => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(w));
    if (slash) [d, m, y] = slash.split('/').map(Number);
    else {
      for (let i = 0; i < t.length; i++) {
        const w = t[i];
        if (w in MONTH) { m = MONTH[w]; continue; }
        if (/^\d{4}$/.test(w)) { y = Number(w); continue; }
        if ((w === 'do' || w === 'दो' || w === 'two') && t[i + 1] in UNIT && UNIT[t[i + 1]] === 1e3) { y = 2000; i++; const nx = t[i + 1]; if (nx && (/^\d{1,2}$/.test(nx) || nx in NUM)) { y += /^\d+$/.test(nx) ? Number(nx) : NUM[nx]; i++; } continue; }
        const n = /^\d{1,2}$/.test(w) ? Number(w) : (w in NUM ? NUM[w] : null);
        if (n !== null) { if (d === null && m === null) d = n; else if (m === null && d !== null && n <= 12) m = n; else if (d === null) d = n; }
      }
    }
    if (!d || !m || !y) return { ok: false, why: 'Need a day, a month and a year' };
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return { ok: false, why: 'That date does not exist' };
    const age = (Date.now() - dt.getTime()) / 31557600000;
    if (age < 5 || age > 100) return { ok: false, why: 'That gives an age outside 5 to 100' };
    return { ok: true, value: `${String(d).padStart(2, '0')}-${String(m).padStart(2, '0')}-${y}` };
  }
  function name(text) {
    let s = String(text).trim().replace(/^(my name is|i am|mera naam|mera nam|naam|मेरा नाम|नाम)\s+/i, '').replace(/\s+(hai|hain|है|हैं)[.।]?$/i, '').replace(/[.।]$/, '').trim();
    if (s.length < 2 || /\d/.test(s)) return { ok: false, why: 'That does not look like a name' };
    return { ok: true, value: s.replace(/\b[a-z]/g, c => c.toUpperCase()) };
  }
  function choice(text, options) { // options: { Value: [keywords] }
    const t = toks(text); for (const v in options) if (options[v].some(k => t.includes(k))) return { ok: true, value: v };
    return { ok: false, why: 'Please say one of: ' + Object.keys(options).join(', ') };
  }
  function yesNo(text) { const t = toks(text);
    if (t.some(w => ['nahi', 'nahin', 'no', 'galat', 'नहीं', 'नही', 'गलत', 'ग़लत', 'wrong'].includes(w))) return 'no';
    if (t.some(w => ['haan', 'han', 'ha', 'yes', 'sahi', 'theek', 'thik', 'correct', 'हाँ', 'हां', 'सही', 'ठीक', 'जी'].includes(w))) return 'yes';
    return null; }

  // The demo form. `confirm: true` = read it back before saving, because a mistake is costly and hard to spot.
  const GENDER = { Female: ['female', 'mahila', 'ladki', 'aurat', 'woman', 'महिला', 'स्त्री', 'लड़की'], Male: ['male', 'purush', 'ladka', 'aadmi', 'man', 'पुरुष', 'लड़का'], Other: ['other', 'anya', 'अन्य'] };
  const FIELDS = [
    { id: 'name', type: 'name', confirm: false, hi: 'आपका पूरा नाम क्या है?', en: 'What is your full name?', label: 'Full name' },
    { id: 'dob', type: 'date', confirm: true, hi: 'आपकी जन्म तारीख क्या है? जैसे, पाँच मार्च दो हज़ार पाँच।', en: 'What is your date of birth? For example, 5 March 2005.', label: 'Date of birth' },
    { id: 'gender', type: 'gender', confirm: false, hi: 'आप महिला हैं, पुरुष हैं, या अन्य?', en: 'Are you female, male, or other?', label: 'Gender' },
    { id: 'mobile', type: 'mobile', confirm: true, hi: 'अपना मोबाइल नंबर एक-एक अंक करके बोलिए।', en: 'Say your mobile number, one digit at a time.', label: 'Mobile number' },
    { id: 'pin', type: 'pin', confirm: true, hi: 'आपके इलाके का पिन कोड क्या है?', en: 'What is your area PIN code?', label: 'PIN code' },
    { id: 'income', type: 'amount', confirm: true, hi: 'आपके परिवार की साल भर की कमाई कितनी है?', en: 'What does your family earn in a year?', label: 'Family income per year' }
  ];
  const PARSERS = { name, date, mobile, pin, amount, gender: t => choice(t, GENDER) };
  const parse = (field, text) => PARSERS[field.type](text);
  const spaced = s => s.split('').join(' ');
  function readBack(field, value, lang) {
    const shown = field.type === 'mobile' ? value.slice(0, 5) + ' ' + value.slice(5) : field.type === 'amount' ? '₹' + Number(value).toLocaleString('en-IN') : value;
    const spoken = field.type === 'mobile' || field.type === 'pin' ? spaced(value) : field.type === 'amount' ? String(value) + (lang === 'hi' ? ' रुपये' : ' rupees') : value;
    return { shown, speak: lang === 'hi' ? `मैंने सुना: ${spoken}. क्या यह सही है?` : `I heard: ${spoken}. Is that right?` };
  }
  return { digits, mobile, pin, amount, date, name, choice, yesNo, FIELDS, parse, readBack };
});
