const DEMO_LIMIT = 100;
const STORAGE_KEYS = {
  demoClicks: 'bh_demo_clicks',
  subActive: 'bh_sub_active',
  savedState: 'bh_saved_state'
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
  document.querySelectorAll('[data-group],#undo,#reset,#restore').forEach(el => el.disabled = disabled);
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
const TOTAL_ACES = TOTAL_DECKS * 4;

const stateEl = document.getElementById('state');
const decisionEl = document.getElementById('decision');

let data = {
  count: 0,
  cards_entered: 0,
  aces_count: 0,
  history: []
};

function saveState() {
  const stateToSave = {
    count: data.count,
    cards_entered: data.cards_entered,
    aces_count: data.aces_count,
    history: [...data.history]
  };
  localStorage.setItem(STORAGE_KEYS.savedState, JSON.stringify(stateToSave));
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEYS.savedState);
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      data = {
        count: parsedState.count || 0,
        cards_entered: parsedState.cards_entered || 0,
        aces_count: parsedState.aces_count || 0,
        history: parsedState.history || []
      };
      return true;
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  }
  return false;
}

if (loadState()) {
  console.log('State loaded from localStorage');
}

setDemoClicks(getDemoClicks());
if (isSubscribed()) {
  disableControls(false);
  const chip = document.getElementById('demo-chip');
  if (chip) chip.textContent = 'Подписка активна';
} else {
  if (getDemoClicks() >= DEMO_LIMIT) {
    showPaywall();
  }
}

// ... (здесь должен быть полный decision_data, но он слишком большой) ...

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
    
    saveState();
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

document.getElementById('restore')?.addEventListener('click', () => {
    if (loadState()) {
        renderState();
        alert('Состояние восстановлено!');
    } else {
        alert('Нет сохраненного состояния для восстановления');
    }
});

// Восстанавливаем состояние при загрузке страницы
window.addEventListener('load', () => {
    if (loadState()) {
        renderState();
    }
});

renderState();

const handInput = document.querySelector('input[name="hand"]');
handInput?.focus();

const haveKeyBtn = document.getElementById('have-key');
const keyBlock = document.getElementById('key-block');
const keyInput = document.getElementById('key-input');
const applyKeyBtn = document.getElementById('apply-key');
const keyMsg = document.getElementById('key-msg');
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
