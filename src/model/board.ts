enum LETTER_TYPES {
	INCORRECT,
	EXISTS,
	CORRECT,
}

const DEFAULT_WORD = "wasd";
const DEFAULT_ATTEMPTS = 7;
const DEFAULT_WORD_LENGTH = 4;

/**
 * QWERTLE configurations, including number of guesses allowed,
 * number of letters per word, and the word to guess. Used to
 * create Board objects.
 */
class BoardConfigs {
	word: string;
	wordLength: number;
	attempts: number;

	constructor(
		word: string = DEFAULT_WORD,
		wordLength: number = DEFAULT_WORD_LENGTH,
		allowedAttempts: number = DEFAULT_ATTEMPTS
	) {
		this.word = word;
		this.wordLength = wordLength;
		this.attempts = allowedAttempts;
	}
}

/**
 * Class containing board information, including previous guesses,
 * configurations, and validations for letters and guesses.
 */
class Board {
	currentAttempt: number;
	word: string;
	wordLength: number;
	numAttempts: number;
	attempts: string[];

	/**
	 * Creates a new Board with
	 * @param {*} word
	 */
	constructor(configs: BoardConfigs) {
		this.currentAttempt = 0;
		this.word = configs.word;
		this.wordLength = configs.wordLength;
		this.numAttempts = configs.attempts;
		this.attempts = new Array<string>(this.numAttempts);
	}

	/**
	 * Checks whether a given letter is present in the word, in the correct spot, or neither.
	 * @param letter 1 character string representing the letter given by the user.
	 * @param index 0-based index that the letter was placed.
	 * @returns LETTER_TYPES enum evaluation
	 */
	checkLetter = (letter: string, index: number): LETTER_TYPES => {
		if (this.word[index] === letter) return LETTER_TYPES.CORRECT;
		if (this.word.includes(letter)) return LETTER_TYPES.EXISTS;
		return LETTER_TYPES.INCORRECT;
	};

	/**
	 * Attempts the letters submitted by the user
	 * @param {*} attempt 4 letter word after the user hits enter
	 */
	addAttempt = (attempt: string) => {
		this.attempts[this.currentAttempt] = attempt;
		return false;
	};
}

export { Board, BoardConfigs, LETTER_TYPES };
