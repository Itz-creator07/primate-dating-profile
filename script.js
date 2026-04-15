// =============================================
//   TRUE MATCH — Kipunji Primate Dating Profile
//   script.js
// =============================================

// ---------- Traits to Match ----------
const TRAITS = [
  {
    id: 'habitat',
    label: 'Native Country',
    keywords: ['tanzania', 'tanzanian', 'east africa', 'africa'],
    hint: 'It\'s an East African country famous for Mount Kilimanjaro 🏔️'
  },
  {
    id: 'arboreal',
    label: 'Lives in Trees',
    keywords: ['tree', 'trees', 'arboreal', 'canopy', 'climbing', 'climb'],
    hint: 'Think high up — I rarely touch the ground 🌳'
  },
  {
    id: 'diet',
    label: 'Frugivore Diet',
    keywords: ['fruit', 'fruits', 'leaves', 'leaf', 'seeds', 'seed', 'bark', 'insects', 'figs', 'frugivore', 'fruit eater'],
    hint: 'I love munching on things that grow on forest trees 🍃'
  },
  {
    id: 'status',
    label: 'Conservation Status',
    keywords: ['endangered', 'threatened', 'rare', 'vulnerable', 'protected', 'iucn'],
    hint: 'The IUCN listed my status in 2018 — not the worst category, but still serious 😢'
  },
  {
    id: 'forest',
    label: 'Montane Forest',
    keywords: ['montane', 'highland', 'mountain', 'cloud', 'afromontane', 'udzungwa', 'rungwe', 'montane forest'],
    hint: 'I live very high up — my forest is often shrouded in clouds ☁️'
  },
  {
    id: 'social',
    label: 'Group Living',
    keywords: ['group', 'groups', 'troop', 'troops', 'social', 'community', 'pack', 'herd', 'band', 'group living'],
    hint: 'I\'m quite the social butterfly — strength in numbers! 🐒'
  },
  {
    id: 'vocal',
    label: 'Vocal Calls',
    keywords: ['call', 'calls', 'vocal', 'sound', 'alarm', 'voice', 'cry', 'vocaliz', 'vocal calls'],
    hint: 'I\'m very loud when danger is near — I warn my whole family 📢'
  },
  {
    id: 'appearance',
    label: 'Distinctive Look',
    keywords: ['mohawk', 'crest', 'mane', 'hair', 'tail', 'tuft', 'whisker', 'chin', 'golden', 'mohawk crest', 'long tail'],
    hint: 'Think punk rock — it\'s all about the hair on top 🎸'
  },
  {
    id: 'discovery',
    label: 'Discovery Year',
    keywords: ['2003', '2006', 'new genus', 'new species', 'discovered', 'first new', '1923', 'rungwecebus'],
    hint: 'I was the first new monkey genus named in nearly a century — spotted in the early 2000s 🔬'
  }
];

// ---------- Rejection Messages ----------
const NO_MATCH_MSGS = [
  "🙅 Not my type! Try again, darling.",
  "❌ Hmm, that's not quite right. Take another guess!",
  "💔 Oh no — that doesn't match. Keep trying!",
  "🤔 Almost? Not really. Give it another shot!",
  "🌿 The forest says no... but I believe in you!",
  "😅 Close, but no fig leaf! Try once more."
];

// ---------- State ----------
let matchedIds = [];
let tries      = 0;
let hintsLeft  = 3;
const TOTAL    = TRAITS.length;

// ---------- DOM ----------
const matchCountEl  = document.getElementById('matchCount');
const tryCountEl    = document.getElementById('tryCount');
const hintCountEl   = document.getElementById('hintCount');
const progressText  = document.getElementById('progressText');
const progressFill  = document.getElementById('progressFill');
const feedbackEl    = document.getElementById('feedback');
const hintDisplayEl = document.getElementById('hintDisplay');
const charInput     = document.getElementById('charInput');
const matchedSection= document.getElementById('matchedSection');
const matchedChips  = document.getElementById('matchedChips');
const matchOverlay  = document.getElementById('matchOverlay');

// ---------- Chip buttons ----------
document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    if (charInput) charInput.value = btn.dataset.value || btn.textContent.replace(/[^\w ]/g,'').trim();
    checkMatch();
  });
});

// ---------- Check Match (called from HTML onclick) ----------
function checkMatch() {
  const val = (charInput ? charInput.value : '').trim();
  if (!val) { showFeedback('Type something first! 📝', 'hint'); return; }

  tries++;
  if (tryCountEl) tryCountEl.textContent = tries;

  // Check against unmatched traits
  const unmatched = TRAITS.filter(t => !matchedIds.includes(t.id));
  let found = null;

  for (const trait of unmatched) {
    if (fuzzyMatch(val, trait.keywords)) { found = trait; break; }
  }

  if (found) {
    matchedIds.push(found.id);
    showFeedback('✅ ' + found.label + ' matched! Great job!', 'correct');
    if (hintDisplayEl) hintDisplayEl.textContent = '';
    updateProgress();
    renderMatchedChips();
    if (charInput) charInput.value = '';

    if (matchedIds.length === TOTAL) {
      setTimeout(showMatchOverlay, 600);
    }
  } else {
    const msg = NO_MATCH_MSGS[Math.floor(Math.random() * NO_MATCH_MSGS.length)];
    showFeedback(msg, 'wrong');
    shakeWrapper();
    if (charInput) charInput.value = '';
  }
}

function fuzzyMatch(val, keywords) {
  val = val.toLowerCase().trim();
  return keywords.some(kw => {
    kw = kw.toLowerCase();
    return val.includes(kw) || (kw.includes(val) && val.length > 2);
  });
}

// ---------- Get Hint ----------
function getHint() {
  if (hintsLeft <= 0) {
    showFeedback('No more hints left! You\'ve used them all. 🤷', 'wrong');
    return;
  }
  const unmatched = TRAITS.filter(t => !matchedIds.includes(t.id));
  if (!unmatched.length) { showFeedback('You\'ve matched everything! 🎉', 'correct'); return; }

  const trait = unmatched[0];
  hintsLeft--;
  if (hintCountEl) hintCountEl.textContent = hintsLeft;
  if (hintDisplayEl) hintDisplayEl.textContent = '💡 Hint for "' + trait.label + '": ' + trait.hint;
  showFeedback('Here\'s your hint! 💡', 'hint');
}

// ---------- Reset ----------
function resetGame() {
  matchedIds = [];
  tries      = 0;
  hintsLeft  = 3;
  if (charInput)      charInput.value     = '';
  if (hintDisplayEl)  hintDisplayEl.textContent = '';
  if (hintCountEl)    hintCountEl.textContent   = 3;
  if (matchedSection) matchedSection.style.display = 'none';
  if (matchedChips)   matchedChips.innerHTML = '';
  showFeedback('', '');
  updateProgress();
}

// ---------- Close Overlay ----------
function closeOverlay() {
  if (matchOverlay) matchOverlay.classList.remove('active');
}

// ---------- Update Progress ----------
function updateProgress() {
  const count = matchedIds.length;
  const pct   = Math.round((count / TOTAL) * 100);
  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.textContent  = count + ' / ' + TOTAL + ' traits';
  if (matchCountEl) matchCountEl.textContent  = count;
}

// ---------- Matched Chips ----------
function renderMatchedChips() {
  if (!matchedChips) return;
  matchedChips.innerHTML = '';
  matchedIds.forEach(id => {
    const t = TRAITS.find(x => x.id === id);
    if (!t) return;
    const span = document.createElement('span');
    span.className = 'matched-chip';
    span.textContent = '✔ ' + t.label;
    matchedChips.appendChild(span);
  });
  if (matchedSection) matchedSection.style.display = matchedIds.length ? 'block' : 'none';
}

// ---------- Feedback ----------
function showFeedback(msg, type) {
  if (!feedbackEl) return;
  feedbackEl.textContent = msg;
  feedbackEl.className = 'feedback';
  if (type === 'correct') feedbackEl.classList.add('feedback-correct');
  if (type === 'wrong')   feedbackEl.classList.add('feedback-wrong');
  if (type === 'hint')    feedbackEl.classList.add('feedback-hint');
}

// ---------- Shake ----------
function shakeWrapper() {
  const el = document.querySelector('.game-wrapper');
  if (!el) return;
  el.classList.remove('game-shake');
  void el.offsetWidth;
  el.classList.add('game-shake');
  el.addEventListener('animationend', () => el.classList.remove('game-shake'), { once: true });
}

// ---------- Match Overlay ----------
function showMatchOverlay() {
  launchConfetti();
  if (matchOverlay) matchOverlay.classList.add('active');
}

// ---------- Confetti ----------
function launchConfetti() {
  const colors = ['#3a7d44','#8b5e3c','#f5c542','#e05c3a','#4e9a5a','#a0714f','#ff6b6b','#ffe066'];
  const layer  = document.getElementById('confettiLayer');
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width  = (8 + Math.random() * 8) + 'px';
      el.style.height = (8 + Math.random() * 8) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
      el.style.animationDelay   = (Math.random() * 0.5) + 's';
      (layer || document.body).appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 20);
  }
}
