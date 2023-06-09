import { Letter, LETTER_STATUS } from "./letter";
import { LETTER_MAPS } from "./lettermaps";

const DEFAULT_WORD = "wasd";
const DEFAULT_ATTEMPTS = 7;
const DEFAULT_WORD_LENGTH = 4;
const DEFAULT_KEYBOARD_LAYOUT = LETTER_MAPS.QWERTY;

/**
 * QWERTLE configurations, including number of guesses allowed,
 * number of letters per word, and the word to guess. Used to
 * create Board objects.
 */
class BoardConfigs {
	word: string;
	wordLength: number;
	allowedAttempts: number;
	keyboardLayout: { layout: string[][]; map: {} };

	// for testing purposes, default configurations exist if no parameters are given
	constructor(
		word: string = DEFAULT_WORD,
		wordLength: number = DEFAULT_WORD_LENGTH,
		allowedAttempts: number = DEFAULT_ATTEMPTS,
		keyboardLayout: {
			layout: string[][];
			map: {};
		} = DEFAULT_KEYBOARD_LAYOUT
	) {
		this.word = word;
		this.wordLength = wordLength;
		this.allowedAttempts = allowedAttempts;
		this.keyboardLayout = keyboardLayout;
	}
}

/**
 * Class containing board information, including previous guesses,
 * configurations, and validations for letters and guesses.
 */
class Board {
	configs: BoardConfigs;
	currentAttempt: number;
	currentLetter: number;
	attempts: string[];

	/**
	 * Creates a new Board with
	 * @param {*} word
	 */
	constructor(configs: BoardConfigs, attempts: Letter[][]) {
		this.configs = configs;
		(this.currentAttempt = 0), (this.currentLetter = 0);
		this.attempts = new Array<string>(this.configs.allowedAttempts);
	}

	/**
	 * Checks whether a given letter is present in the word, in the correct spot, or neither.
	 * @param letter 1 character string representing the letter given by the user.
	 * @param index 0-based index that the letter was placed.
	 * @returns LETTER_STATUS enum evaluation
	 */
	checkLetter = (letter: string, index: number): LETTER_STATUS => {
		if (this.configs.word[index] === letter) return LETTER_STATUS.CORRECT;
		if (this.configs.word.includes(letter)) return LETTER_STATUS.MISPLACED;
		return LETTER_STATUS.INCORRECT;
	};

	addLetter: (letter: string) => Board | void = (letter: string) => {};
}

export { Board, BoardConfigs, LETTER_STATUS };
