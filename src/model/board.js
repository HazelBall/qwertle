const LETTER_TYPES = {
	CORRECT: "correct",
	INCORRECT: "incorrect",
	EXISTS: "exists",
};

/**
 * QWERTLE configurations, including number of guesses allowed,
 * number of letters per word, and the word to guess. Used to
 * create Board objects.
 */
class BoardConfigs {
	DEFAULT_WORD = "wasd";
	DEFAULT_ATTEMPTS = 7;
	DEFAULT_WORD_LENGTH = 4;

	constructor(
		word = DEFAULT_WORD,
		wordLength = DEFAULT_WORD_LENGTH,
		allowedAttempts = DEFAULT_ATTEMPTS
	) {
		this.word = word;
		this.length = letters;
		this.attempts = attempts;
	}
}

/**
 * Class containing board information, including previous guesses,
 * configurations, and validations for letters and guesses.
 */
class Board {
	/**
	 * Creates a new Board with
	 * @param {*} word
	 */
	constructor(configs) {
		this.currentGuess = 0;
		this.word = configs.word;
		this.wordLength = configs.wordLength;
		this.numAttempts = configs.attempts;
	}

	getLetterType(letter, index) {
		if (this.word[index] === letter) return LETTER_TYPES.CORRECT;
		if (this.word.includes(letter)) return LETTER_TYPES.EXISTS;
		return LETTER_TYPES.INCORRECT;
	}

    isCorrectGuess(word) {
        for(var i = 0; i < this.)
    }

	/**
	 * Attempts the letters submitted by the user
	 * @param {*} attempt 4 letter word after the user hits enter
	 */
	attempt(attempt) {
		return false;
	}
}

export { Board, BoardConfigs, LETTER_TYPES };
