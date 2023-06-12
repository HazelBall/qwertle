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
	keyboardLayout: { layout: string[][]; map: Map<string, string[]> };

	// for testing purposes, default configurations exist if no parameters are given
	constructor(
		word: string = DEFAULT_WORD,
		wordLength: number = DEFAULT_WORD_LENGTH,
		allowedAttempts: number = DEFAULT_ATTEMPTS,
		keyboardLayout: {
			layout: string[][];
			map: Map<string, string[]>;
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
	attempts: (Letter | null)[][];
	keyboard: Letter[][];

	/**
	 * Create a new board object with the given configurations,
	 * with optional values if copying from a previous board.
	 * @param configs
	 * 		BoardConfigs object with the word, word length, max
	 * 		attempts, and keyboard layout.
	 * @param currentAttempt
	 * 		Current guess number (0 if not given)
	 * @param currentLetter
	 * 		Current letter (0 if not given)
	 * @param attempts
	 * 		2D array of Letter objects or null, containing the
	 * 		letter guesses.
	 */
	constructor(
		configs: BoardConfigs,
		currentAttempt: number = 0,
		currentLetter: number = 0,
		attempts: (Letter | null)[][] | null = null,
		keyboard: null | Letter[][] = null
	) {
		this.configs = configs;
		this.currentAttempt = currentAttempt;
		this.currentLetter = currentLetter;

		// Save previous attempts if given, or create a blank board
		if (attempts !== null) {
			this.attempts = attempts;
		} else {
			this.attempts = [];

			// board will be filled with nulls, but these can be filled in as game progresses.
			for (let i = 0; i < this.configs.allowedAttempts; i++) {
				let row: (Letter | null)[] = [];
				for (let j = 0; j < this.configs.wordLength; j++) {
					row.push(null);
				}
				this.attempts.push(row);
			}
		}

		if (keyboard !== null) {
			this.keyboard = keyboard;
		} else {
			this.keyboard = [];
			let layout = this.configs.keyboardLayout.layout;
			for (let i = 0; i < layout.length; i++) {
				let row: Letter[] = [];
				for (
					let j = 0;
					j < this.configs.keyboardLayout.layout[i].length;
					j++
				) {
					row.push(new Letter(layout[i][j]));
				}
				this.keyboard.push(row);
			}
		}
	}

	/**
	 * Checks whether a given letter is present in the word, in the correct spot, or neither.
	 * @param letter 1 character string representing the letter given by the user.
	 * @param index 0-based index that the letter was placed.
	 * @returns LETTER_STATUS enum evaluation
	 */
	checkLetter = (letter: Letter, index: number): LETTER_STATUS => {
		if (this.configs.word[index] === letter.letter)
			return LETTER_STATUS.CORRECT;
		if (this.configs.word.includes(letter.letter))
			return LETTER_STATUS.MISPLACED;
		return LETTER_STATUS.INCORRECT;
	};

	/**
	 * Returns a new board object with the added letter, or the same object if the current guess has reached the word length.
	 * @param newLetter new string letter (e.g. 'a')
	 * @returns new Board object
	 */
	addLetter = (newLetter: string) => {
		console.log("Trying to Add Letter...");
		if (this.currentLetter >= this.configs.wordLength) return this;
		return new Board(
			this.configs,
			this.currentAttempt,
			this.currentLetter + 1,
			this.attempts.map((row, rowIndex) => {
				return rowIndex !== this.currentAttempt
					? row
					: row.map((letter: Letter | null, letterIndex) => {
							return letterIndex === this.currentLetter
								? new Letter(newLetter)
								: letter;
					  });
			}),
			// Select the letter on the keyboard and disable any letters not already selected
			this.keyboard.map((row: Letter[]) => {
				return row.map((letter) => {
					if (letter.letter === newLetter)
						return letter
							.updateSelection(true)
							.updateValidity(false);
					if (
						!this.configs.keyboardLayout.map
							.get(letter.letter)
							?.includes(newLetter)
					)
						return letter.updateValidity(false);
					return letter;
				});
			})
		);
	};

	/**
	 * Returns a new board object with the last letter removed, or the same object if the current guess has no letters
	 * @returns new Board object
	 */
	removeLetter = () => {
		if (this.currentLetter <= 0) return this;
		let lastLetter = this.attempts[this.currentAttempt][this.currentLetter];
		let prevLetter =
			this.attempts[this.currentAttempt][this.currentLetter - 1];
		return new Board(
			this.configs,
			this.currentAttempt,
			this.currentLetter - 1,
			this.attempts.map((row, rowIndex) => {
				return rowIndex !== this.currentAttempt
					? row
					: row.map((letter: Letter | null, letterIndex) => {
							return letterIndex === this.currentLetter - 1
								? null
								: letter;
					  });
			}),

			// Update which letters can be guessed next
			this.keyboard.map((row) => {
				return row.map((letter) => {
					if (
						lastLetter !== null &&
						letter.letter === lastLetter.letter
					)
						return letter
							.updateSelection(false)
							.updateValidity(true);
					if (
						prevLetter !== null &&
						this.configs.keyboardLayout.map
							.get(letter.letter)
							?.includes(prevLetter.letter)
					)
						return letter.updateValidity(true);
					return letter.updateValidity(false);
				});
			})
		);
	};

	/**
	 * Returns a new board object with the current guess removed, or the same object if the current guess has no letters
	 * @returns new Board object
	 */
	clearGuess = () => {
		if (this.currentLetter == 0) return this;
		return new Board(
			this.configs,
			this.currentAttempt,
			0,
			this.attempts.map((row, rowIndex) => {
				return rowIndex !== this.currentAttempt
					? row
					: row.map((letter) => {
							return null;
					  });
			}),
			this.keyboard.map((row) => {
				return row.map((letter) => {
					return letter.updateValidity(true).updateSelection(false);
				});
			})
		);
	};

	/**
	 * Returns a new board object with the current guess submitted, checking the status of each guess for the keyboard and game board
	 * @returns
	 */
	submitGuess = () => {
		if (this.currentLetter != this.configs.wordLength) return this;
		return new Board(
			this.configs,
			this.currentAttempt + 1,
			0,
			this.attempts.map((row, rowIndex) => {
				return rowIndex !== this.currentAttempt
					? row
					: row.map((letter, letterIndex) => {
							if (letter === null)
								throw new Error("Letter is null?!");
							return letter.updateStatus(
								this.checkLetter(letter, letterIndex)
							);
					  });
			}),
			this.keyboard.map((row) => {
				return row.map((letter) => {
					// All letters should be valid and unselected next guess.
					let newLetter = letter
						.updateValidity(true)
						.updateSelection(false);

					// If the letter wasn't part of the last guess, then great job, we don't need to do anything else!
					if (!letter.isSelected) return newLetter;

					/*
						If the current keyboard letter is selected, we need to find the letter within the last guess in order 
						to compare the statuses of the keyboard and attempt letter, and keep the highest ranking one.
					*/
					let matchingLetter: Letter | null = null;
					let currentAttemptRow: (Letter | null)[] =
						this.attempts[this.currentAttempt];

					for (let attemptLetter of currentAttemptRow)
						if (
							attemptLetter &&
							attemptLetter.letter === letter.letter
						)
							matchingLetter = attemptLetter;

					return matchingLetter
						? newLetter.updateStatus(
								Math.max(letter.status, matchingLetter.status)
						  )
						: newLetter;
				});
			})
		);
	};
}

export { Board, BoardConfigs, LETTER_STATUS };
