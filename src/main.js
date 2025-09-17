const DEMO_LIMIT = 100;
const STORAGE_KEYS = {
  demoClicks: 'bh_demo_clicks',
  subActive: 'bh_sub_active'
};

function isSubscribed(){
  const url = new URL(location.href);
  if (url.searchParams.get('sub') === '1') {
    localStorage.setItem(STORAGE_KEYS.subActive,'1');
    history.replaceState({},'',url.pathname + url.hash);
  }
  return localStorage.getItem(STORAGE_KEYS.subActive) === '1';
}

function getDemoClicks(){
  return parseInt(localStorage.getItem(STORAGE_KEYS.demoClicks) || '0', 10);
}

function setDemoClicks(v){
  localStorage.setItem(STORAGE_KEYS.demoClicks, String(v));
  const chip = document.getElementById('demo-chip');
  if (chip && !isSubscribed()) chip.textContent = `Демо: ${Math.min(v,DEMO_LIMIT)} / ${DEMO_LIMIT}`;
  if (chip && isSubscribed()) chip.textContent = 'Подписка активна';
}

function disableControls(disabled){
  document.querySelectorAll('[data-group],#undo,#reset').forEach(el => el.disabled = disabled);
}

function showPaywall(){
  const ov = document.getElementById('paywall');
  ov?.classList.remove('hidden');
  ov?.setAttribute('aria-hidden','false');
  disableControls(true);
}

function hidePaywall(){
  const ov = document.getElementById('paywall');
  ov?.classList.add('hidden');
  ov?.setAttribute('aria-hidden','true');
  if (isSubscribed()) disableControls(false);
}

const groupValues = {
  '2 / 7': 0.5,
  '3 / 4 / 6': 1,
  '5': 1.5,
  '8': 0,
  '9': -0.5,
  '10 / J / Q / K': -1,
  'A': 0
};

const TOTAL_DECKS = 8;
const TOTAL_CARDS = TOTAL_DECKS * 52;
const TOTAL_ACES  = TOTAL_DECKS * 4;

const stateEl    = document.getElementById('state');
const decisionEl = document.getElementById('decision');

const data = { count: 0, cards_entered: 0, aces_count: 0, history: [] };

setDemoClicks(getDemoClicks());
if (isSubscribed()) {
  disableControls(false);
  const chip = document.getElementById('demo-chip');
  if (chip) chip.textContent = 'Подписка активна';
} else {
  if (getDemoClicks() >= DEMO_LIMIT) showPaywall();
}

const decision_data = {
  "9":  { "2":{"0":"Hit","1":"Hit","2":"Hit","3":"Double","4":"Double","5":"Double"},
          "3":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "4":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Double","4":"Double","5":"Double"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "10": { "2":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "3":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "4":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "8":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "9":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "11": { "2":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "3":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "4":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "8":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "9":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "T":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "12": { "2":{"0":"Hit","1":"Hit","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "3":{"0":"Hit","1":"Hit","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "4":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "5":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "6":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "7":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Stand","5":"Stand"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "13": { "2":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "3":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "4":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "5":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "6":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "7":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "8":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "9":{"0":"Hit","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "T":{"0":"Hit","1":"Hit","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "14": { "2":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "3":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "4":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "5":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "6":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "7":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "8":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "9":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "T":{"0":"Hit","1":"Hit","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "15": { "2":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "3":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "4":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "5":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "6":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "7":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "8":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "9":{"0":"Hit","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "T":{"0":"Hit","1":"Hit","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "16": { "2":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "3":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "4":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "5":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "6":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "7":{"0":"Hit","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "8":{"0":"Hit","1":"Hit","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Stand","4":"Stand","5":"Stand"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Stand","5":"Stand"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "A2": { "2":{"0":"Hit","1":"Hit","2":"Double","3":"Double","4":"Double","5":"Double"},
          "3":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "4":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Double","5":"Double"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "A3": { "2":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "3":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "4":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Double","5":"Double"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "A4": { "2":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "3":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "4":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Double","5":"Double"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "A5": { "2":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "3":{"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "4":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Double","5":"Double"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "A6": { "2":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "3":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "4":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "A7": { "2":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "3":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "4":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "5":{"0":"Stand","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "8":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "9":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "T":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "A":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"} },
  "22": { "2":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "3":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "4":{"0":"Hit","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "5":{"0":"Hit","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "6":{"0":"Hit","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "7":{"0":"Hit","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "33": { "2":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "3":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "4":{"0":"Hit","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "5":{"0":"Hit","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "6":{"0":"Hit","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "7":{"0":"Hit","1":"Hit","2":"Split","3":"Split","4":"Split","5":"Split"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "44": { "2":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "3":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "4":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "5":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "6":{"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
          "7":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "66": { "2":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "3":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "4":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "5":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "6":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "7":{"0":"Hit","1":"Hit","2":"Split","3":"Split","4":"Split","5":"Split"},
          "8":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "77": { "2":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "3":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "4":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "5":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "6":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "7":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "8":{"0":"Hit","1":"Hit","2":"Split","3":"Split","4":"Split","5":"Split"},
          "9":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "T":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
          "A":{"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"} },
  "99": { "2":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "3":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "4":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "5":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "6":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "7":{"0":"Stand","1":"Stand","2":"Split","3":"Split","4":"Split","5":"Split"},
          "8":{"0":"Split","1":"Split","2":"Split","3":"Split","4":"Split","5":"Split"},
          "9":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "T":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"},
          "A":{"0":"Stand","1":"Stand","2":"Stand","3":"Stand","4":"Stand","5":"Stand"} }
};

function getRemainingDecks(){ 
  return Math.max((TOTAL_CARDS - data.cards_entered) / 52, 1); 
}
function round(x, n = 2){ 
  return Math.round(x * 10**n) / 10**n; 
}
function getTrueCount(){ 
  return round(data.count / getRemainingDecks(), 2); 
}
function edgeText(tc){
  return tc <= 0 
    ? "⚠️ Low count — minimum or skip the hand" 
    : `📈 Edge: ${round(tc * 0.5, 2)}%`;
}

function renderState() {
  const remainingDecks = round(getRemainingDecks(), 2);
  const trueCount = getTrueCount();
  const edgeMsg = edgeText(trueCount);

  if (!stateEl) return;
  stateEl.textContent = `
🂠 Cards seen: ${data.cards_entered} / ${TOTAL_CARDS}
🂱 Aces seen: ${data.aces_count} / ${TOTAL_ACES}
📉 Decks remaining: ${remainingDecks}
📈 True Count: ${trueCount}
${edgeMsg}
  `;
}

document.querySelectorAll('[data-group]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!isSubscribed()) {
      const clicks = getDemoClicks() + 1;
      setDemoClicks(clicks);
      if (clicks > DEMO_LIMIT) {
        showPaywall();
        return;
      }
    }
    const g = btn.getAttribute('data-group');
    if (g === 'A') data.aces_count += 1;
    else data.count += groupValues[g] || 0;

    data.cards_entered += 1;
    data.history.push(g);
    renderState();
  });
});

document.getElementById('undo')?.addEventListener('click', () => {
  if (!isSubscribed() && getDemoClicks() > DEMO_LIMIT) return;
  const last = data.history.pop();
  if (!last) return;
  if (last === 'A') data.aces_count -= 1;
  else data.count -= groupValues[last] || 0;
  data.cards_entered -= 1;
  renderState();
});

document.getElementById('reset')?.addEventListener('click', () => {
  if (!isSubscribed() && getDemoClicks() > DEMO_LIMIT) return;
  data.count = 0;
  data.cards_entered = 0;
  data.aces_count = 0;
  data.history = [];
  renderState();
});

function parseHandInput(textHand, textDealer){
  const clean = s => (s || '').trim().toLowerCase().replace(/\s+/g,'');
  const t = clean(textHand);
  let dealer = clean(textDealer).toUpperCase().replace(/10|j|q|k/gi,'T');

  let parts;
  if (t.includes('-')) parts = t.split('-');
  else if (t.includes('+')) parts = t.split('+');
  else parts = t.match(/[0-9]+|[ajqk]/gi) || [];

  if (!dealer && t.includes('-') && parts.length >= 2) {
    dealer = parts[1].toUpperCase().replace(/10|J|Q|K/g,'T');
  }

  if (t.includes('+')) {
    const [l, r] = parts;
    if (!l || !r || l !== r) return [null,null,null];
    let val = l;
    if (/^[jqk]$/i.test(val)) val = '10';
    if (val === '1') return ['11', dealer, 'hard'];
    return [(val + val).toUpperCase(), dealer, 'pair'];
  }

  if (parts.length === 1) {
    const token = parts[0];
    if (token && (token.length === 2 || token.length === 4)) {
      const half = token.length / 2;
      if (token.slice(0,half) === token.slice(half)) {
        if (token === '11') return ['11', dealer, 'hard'];
        if (token === 'jj' || token === 'qq' || token === 'kk') return ['1010', dealer, 'pair'];
        return [token.toUpperCase(), dealer, 'pair'];
      }
    }
  }

  const isSoftOneToken = parts.length === 1 && /^(a\d+|\d+a)$/i.test(parts[0]);
  const isSoftTwoTokens = parts.length >= 2 && (
    (parts[0] === 'a' && /^\d+$/.test(parts[1])) ||
    (parts[1] === 'a' && /^\d+$/.test(parts[0]))
  );

  if (isSoftOneToken || isSoftTwoTokens) {
    let num;
    if (isSoftOneToken) {
      const tok = parts[0];
      num = tok.replace(/a/ig,'');
    } else {
      num = parts[0] === 'a' ? parts[1] : parts[0];
    }
    if (!num) return ['A1', dealer, 'soft'];
    if (!/^\d+$/.test(num)) return [null,null,null];
    return ['A' + String(parseInt(num,10)), dealer, 'soft'];
  }

  if (t.includes('-') && parts.length >= 1 && /^\d+$/.test(parts[0])) {
    return [parts[0], dealer, 'hard'];
  }
  if (parts.length >= 1 && /^\d+$/.test(parts[0])) {
    return [parts[0], dealer, 'hard'];
  }

  return [null,null,null];
}

function fixedPairDecision(player, type){
  if (type !== 'pair') return null;
  const pair = player.toUpperCase();
  if (pair === 'AA' || pair === '88') return 'Split';
  const m = pair.match(/(10|[TJQK])(?:\1)$/);
  if (m) return 'Stand';
  return null;
}

function lookupDecision(player, dealer, type, trueCount){
  const tc_key = String(Math.min(Math.max(parseInt(trueCount,10),0),5));
  const fixed = fixedPairDecision(player, type);
  if (fixed) return fixed;

  if (type === 'hard' && /^\d+$/.test(player)){
    const v = parseInt(player,10);
    if (v <= 8) return 'Hit';
    if (v >= 17) return 'Stand';
  }
  const d = dealer.replace(/10|J|Q|K/g,'T');
  if (decision_data[player] && decision_data[player][d] && decision_data[player][d][tc_key])
    return decision_data[player][d][tc_key];
  return null;
}

document.getElementById('decision-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const hand = String(form.get('hand') || '');
  const dealer = String(form.get('dealer') || '');

  const [player, d, type] = parseHandInput(hand, dealer);
  if (!player || !d){
    decisionEl.textContent = '❌ Неверный формат. Примеры: 13-7, A4, 88, 10+10, 9-A';
    return;
  }
  const tc = getTrueCount();
  const action = lookupDecision(player, d, type, tc);

  decisionEl.textContent =
`🃏 Hand: ${player} vs ${d} (${type})
📈 True Count: ${tc}
${action ? '✅ Recommended Action: ' + action : '❌ No data for this hand yet.'}`;
});

renderState();

const handInput = document.querySelector('input[name="hand"]');
handInput?.focus();

const haveKeyBtn      = document.getElementById('have-key');
const keyBlock        = document.getElementById('key-block');
const keyInput        = document.getElementById('key-input');
const applyKeyBtn     = document.getElementById('apply-key');
const keyMsg          = document.getElementById('key-msg');
const closePaywallBtn = document.getElementById('close-paywall');

haveKeyBtn?.addEventListener('click', () => {
  keyBlock?.classList.remove('hidden');
  keyInput?.focus();
});

closePaywallBtn?.addEventListener('click', () => hidePaywall());

const VALID_KEY = 'BJ-HELPER-2025';
applyKeyBtn?.addEventListener('click', () => {
  const val = (keyInput?.value || '').trim();
  if (!val) return;
  if (val === VALID_KEY) {
    localStorage.setItem(STORAGE_KEYS.subActive,'1');
    keyMsg.textContent = 'Подписка активирована ✔';
    hidePaywall();
    disableControls(false);
    const chip = document.getElementById('demo-chip');
    if (chip) chip.textContent = 'Подписка активна';
  } else {
    keyMsg.textContent = 'Неверный ключ. Проверьте письмо после оплаты.';
  }
});

