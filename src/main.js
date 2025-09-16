// Группы карт и их веса Wong Halves
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

const data = { count: 0, cards_entered: 0, aces_count: 0, history: [] };

// TODO: Вставь сюда твой полный decision_data из бота
const decision_data = {
    "9": {
        "2": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Double", "4": "Double", "5": "Double"},
        "3": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "4": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "8": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Double", "4": "Double", "5": "Double"},
        "9": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "T": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "A": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"}
    },
    "10": {
        "2": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "3": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "4": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "8": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "9": {"0": "Hit",    "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "T": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "A": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"}
    },
    "11": {
            "2": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "3": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "4": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "7": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "8": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "9": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "T": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
            "A": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"}
        },
    "12": {
            "2": {"0": "Hit", "1": "Hit", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
            "3": {"0": "Hit", "1": "Hit", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
            "4": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
            "5": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
            "6": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
            "7": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Stand", "5": "Stand"},
            "8": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
            "9": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
            "T": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
            "A": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"}
        },
    "13": {
        "2": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "3": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "4": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "5": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "6": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "7": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "8": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "9": {"0": "Hit",   "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "T": {"0": "Hit",   "1": "Hit",   "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "A": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"}
    },
    "14": {
        "2": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "3": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "4": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "5": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "6": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "7": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "8": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "9": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "T": {"0": "Hit",   "1": "Hit",   "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "A": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"}
    },
    "15": {
                        "2": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "3": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "4": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "5": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "6": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "7": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "8": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "9": {"0": "Hit",   "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "T": {"0": "Hit",   "1": "Hit",   "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
                        "A": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"}
                    },
    "16": {
        "2": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "3": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "4": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "5": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "6": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "7": {"0": "Hit",   "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "8": {"0": "Hit",   "1": "Hit",   "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "9": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Stand", "4": "Stand", "5": "Stand"},
        "T": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Stand", "5": "Stand"},
        "A": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"}
    },
    "A2": {
        "2": {"0": "Hit",    "1": "Hit",    "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "3": {"0": "Hit",    "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "4": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Double", "5": "Double"},
        "8": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "9": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "T": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "A": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"}
    },
    "A3": {
        "2": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "3": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "4": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "8": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Double", "5": "Double"},
        "9": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "T": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "A": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"}
    },
    "A4": {
        "2": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "3": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "4": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "8": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Double", "5": "Double"},
        "9": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "T": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "A": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"}
    },
    "A5": {
        "2": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "3": {"0": "Hit", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "4": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Double", "5": "Double"},
        "8": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "9": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "T": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "A": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"}
    },
    "A6": {
        "2": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "3": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "4": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "8": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "9": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "T": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "A": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"}
    },
    "A7": {
        "2": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "3": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "4": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "5": {"0": "Stand", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "8": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "9": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "T": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "A": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"}
    },
    "22": {
        "2": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "3": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "4": {"0": "Hit", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "5": {"0": "Hit", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "6": {"0": "Hit", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "7": {"0": "Hit", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "8": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "9": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "T": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"},
        "A": {"0": "Hit", "1": "Hit", "2": "Hit", "3": "Hit", "4": "Hit", "5": "Hit"}
    },
    "33": {
        "2": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "3": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "4": {"0": "Hit",   "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "5": {"0": "Hit",   "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "6": {"0": "Hit",   "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "7": {"0": "Hit",   "1": "Hit",   "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "8": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"},
        "9": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"},
        "T": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"},
        "A": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"}
    },
    "44": {
        "2": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "3": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "4": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "5": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "6": {"0": "Double", "1": "Double", "2": "Double", "3": "Double", "4": "Double", "5": "Double"},
        "7": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "8": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "9": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "T": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"},
        "A": {"0": "Hit",    "1": "Hit",    "2": "Hit",    "3": "Hit",    "4": "Hit",    "5": "Hit"}
    },
    "66": {
        "2": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "3": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "4": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "5": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "6": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "7": {"0": "Hit",   "1": "Hit",   "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "8": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"},
        "9": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"},
        "T": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"},
        "A": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"}
    },
    "77": {
        "2": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "3": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "4": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "5": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "6": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "7": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "8": {"0": "Hit",   "1": "Hit",   "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "9": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"},
        "T": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"},
        "A": {"0": "Hit",   "1": "Hit",   "2": "Hit",   "3": "Hit",   "4": "Hit",   "5": "Hit"}
    },
    "99": {
        "2": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "3": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "4": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "5": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "6": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "7": {"0": "Stand", "1": "Stand", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "8": {"0": "Split", "1": "Split", "2": "Split", "3": "Split", "4": "Split", "5": "Split"},
        "9": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "T": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"},
        "A": {"0": "Stand", "1": "Stand", "2": "Stand", "3": "Stand", "4": "Stand", "5": "Stand"}
    }
    }

// Пример для руки 9 (можешь удалить после вставки полного словаря)
Object.assign(decision_data, {
  "9": {
    "2": {"0":"Hit","1":"Hit","2":"Hit","3":"Double","4":"Double","5":"Double"},
    "3": {"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
    "4": {"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
    "5": {"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
    "6": {"0":"Double","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
    "7": {"0":"Hit","1":"Double","2":"Double","3":"Double","4":"Double","5":"Double"},
    "8": {"0":"Hit","1":"Hit","2":"Hit","3":"Double","4":"Double","5":"Double"},
    "9": {"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
    "T": {"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"},
    "A": {"0":"Hit","1":"Hit","2":"Hit","3":"Hit","4":"Hit","5":"Hit"}
  }
});

function getRemainingDecks(){ return Math.max((TOTAL_CARDS - data.cards_entered)/52, 1); }
function round(x,n=2){ return Math.round(x*10**n)/10**n; }
function getTrueCount(){ return round(data.count / getRemainingDecks(), 2); }
function edgeText(tc){ return tc<=0 ? "⚠️ Low count — minimum or skip the hand" : `📈 Edge: ${round(tc*0.5,2)}%`; }

function renderState(){
  const remainingDecks = round(getRemainingDecks(),2);
  const tc = getTrueCount();
  stateEl.textContent =
`📊 Running Count: ${round(data.count,2)}
🂠 Cards played: ${data.cards_entered} / ${TOTAL_CARDS}
🂱 Aces played: ${data.aces_count} / ${TOTAL_ACES}
📉 Remaining decks: ${remainingDecks}
📈 True Count: ${tc}
${edgeText(tc)}`;
}

document.querySelectorAll('[data-group]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const g = btn.getAttribute('data-group');
    if (g==='A') data.aces_count += 1;
    else data.count += groupValues[g] || 0;
    data.cards_entered += 1;
    data.history.push(g);
    renderState();
  });
});

document.getElementById('undo').addEventListener('click', ()=>{
  const last = data.history.pop();
  if (!last) return;
  if (last==='A') data.aces_count -= 1;
  else data.count -= groupValues[last] || 0;
  data.cards_entered -= 1;
  renderState();
});
document.getElementById('reset').addEventListener('click', ()=>{
  data.count = 0; data.cards_entered = 0; data.aces_count = 0; data.history = [];
  renderState();
});

function parseHandInput(textHand, textDealer){
  const clean = s=> s.trim().toLowerCase().replace(/\s+/g,'');
  const t = clean(textHand);
  let dealer = (textDealer||'').trim().toUpperCase().replace(/10|J|Q|K/g,'T');

  let parts;
  if (t.includes('-')) parts = t.split('-');
  else if (t.includes('+')) parts = t.split('+');
  else parts = t.match(/[0-9]+|[ajqk]/g);

  if (!parts || parts.length<1) return [null,null,null];
  if (!dealer && parts.length>=2) dealer = parts[1].toUpperCase().replace(/10|J|Q|K/g,'T');

  const player_raw = parts[0];

  if (t.includes('+')){
    const [l,r]=parts; if (l!==r) return [null,null,null];
    let val=l; if (['j','q','k'].includes(val)) val='10';
    if (val==='1') return ['11', dealer, 'hard'];
    return [(val+val).toUpperCase(), dealer, 'pair'];
  }

  if ([2,4].includes(player_raw.length)){
    const half=player_raw.length/2;
    if (player_raw.slice(0,half)===player_raw.slice(half)){
      if (player_raw==='11') return ['11', dealer, 'hard'];
      if (['jj','qq','kk'].includes(player_raw)) return ['1010', dealer, 'pair'];
      return [player_raw.toUpperCase(), dealer, 'pair'];
    }
  }

  if (player_raw.includes('a')){
    const other = player_raw.replace(/a/g,'');
    if (other==='') return ['A1', dealer, 'soft'];
    if (/^\d+$/.test(other)) return ['A'+other, dealer, 'soft'];
    return [null,null,null];
  }

  if (/^\d+$/.test(player_raw)) return [player_raw, dealer, 'hard'];
  return [null,null,null];
}

function fixedPairDecision(player, type){
  if (type!=='pair') return null;
  const pair = player.toUpperCase();
  if (pair==='AA' || pair==='88') return 'Split';
  const m = pair.match(/(10|[TJQK])(?:\1)$/); // любые две десятки/фейсы
  if (m) return 'Stand';
  return null;
}

function lookupDecision(player, dealer, type, trueCount){
  const tc_key = String(Math.min(Math.max(parseInt(trueCount,10),0),5));
  const fixed = fixedPairDecision(player, type);
  if (fixed) return fixed;

  if (type==='hard' && /^\d+$/.test(player)){
    const v = parseInt(player,10);
    if (v<=8) return 'Hit';
    if (v>=17) return 'Stand';
  }
  const d = dealer.replace(/10|J|Q|K/g,'T');
  if (decision_data[player] && decision_data[player][d] && decision_data[player][d][tc_key])
    return decision_data[player][d][tc_key];
  return null;
}

document.getElementById('decision-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const hand = String(form.get('hand')||'');
  const dealer = String(form.get('dealer')||'');

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
${action ? '✅ Recommended Action: '+action : '❌ No data for this hand yet.'}`;
});

renderState();
