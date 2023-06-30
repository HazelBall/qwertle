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
	keyboard: Map<string, Letter>;

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
	 * @param keyboard
	 * 		String to Letter map for the keyboard. The order does not matter because it is given in the board configurations.
	 */
	constructor(
		configs: BoardConfigs,
		currentAttempt: number = 0,
		currentLetter: number = 0,
		attempts: (Letter | null)[][] | null = null,
		keyboard: null | Map<string, Letter>
	) {
		this.configs = configs;
		this.currentAttempt = currentAttempt;
		this.currentLetter = currentLetter;

		// Save previous attempts if given, or create a blank board
		if (attempts !== null) {
			this.attempts = attempts;
		} else {
			this.attempts = [];

			// Board will be filled with nulls, but these can be filled in as game progresses.
			for (let i = 0; i < this.configs.allowedAttempts; i++) {
				let row: (Letter | null)[] = [];
				for (let j = 0; j < this.configs.wordLength; j++) {
					row.push(null);
				}
				this.attempts.push(row);
			}
		}

		// Keyboard Validity is calculated on construction so that it will not need to be updated separately in the reducer or Board.
		this.keyboard = this.setValidity(keyboard);
	}

	/**
	 * Updates the validity of all keys upon creation of the Board object.
	 * @param keyboard
	 * @returns
	 */
	setValidity = (
		keyboard: Map<string, Letter> | null
	): Map<string, Letter> => {
		let keyMap = new Map<string, Letter>();
		if (keyboard === null) {
			// If no keyboard is given, we don't need to worry about the validity, and can assume all letters are valid.
			this.configs.keyboardLayout.layout.forEach((row) => {
				row.forEach((letter) => {
					keyMap.set(
						letter,
						new Letter(letter, true, LETTER_STATUS.DEFAULT, false)
					);
				});
			});
		} else {
			/* 
				If we are given a keyboard, we must assume every letter is invalid, 
				then validate letters next to the current letter
			*/
			this.configs.keyboardLayout.layout.forEach((row) => {
				row.forEach((letter) => {
					let l = keyboard.get(letter);
					if (!l)
						throw new Error(
							"ERROR Updating Validity:\n\
							Letter does not exist in keyboard, but does exist in keyboard layout."
						);
					keyMap.set(letter, l.updateValidity(false));
				});
			});
			let selectedLetter =
				this.attempts[this.currentAttempt][this.currentLetter];
			if (!selectedLetter)
				throw new Error(
					"ERROR Updating Validity:\n\
					Current letter is Null"
				);
			// For each of the adjacent letters, check if they are selected, and otherwise set them as valid
			this.configs.keyboardLayout.map
				.get(selectedLetter.letter)
				?.forEach((adjacentLetter) => {
					if (!keyMap.get(adjacentLetter)?.isSelected) {
						let newLetter = keyMap.get(adjacentLetter);
						keyMap.set(
							adjacentLetter,
							newLetter
								? newLetter.updateValidity(true)
								: new Letter(
										adjacentLetter,
										true,
										LETTER_STATUS.DEFAULT,
										false
								  )
						);
					}
				});
		}
		return keyMap;
	};

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
	 * Updates the given letter's selection status. If the letter does not exist in the keyboard, nothing is changed.
	 * @param letter string value of the letter being updated
	 * @param isSelected new selection status for the letter
	 * @returns updated keyboard Map
	 */
	updateKeyboardSelection = (
		letter: string,
		isSelected: boolean
	): Map<string, Letter> => {
		let newKeyboard = new Map(this.keyboard);
		let value = newKeyboard.get(letter);
		return value instanceof Letter
			? newKeyboard.set(letter, value.updateSelection(isSelected))
			: this.keyboard;
	};

	/**
	 *
	 * @param index the updated
	 * @returns
	 */
	updateKeyboardValidity = (index: number): Map<string, Letter> => {
		let newKeyboard = new Map(this.keyboard);
		if (index <= 0) {
			for (let [key, value] of newKeyboard) {
				newKeyboard.set(key, value.updateValidity(true));
			}
			return newKeyboard;
		}

		// ! TEMP CODE
		return this.keyboard;
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
			this.updateKeyboardSelection(newLetter, true)
		);
	};

	/**
	 * Returns a new board object with the last letter removed, or the same object if the current guess has no letters
	 * @returns new Board object
	 */
	removeLetter = () => {
		if (this.currentLetter <= 0) return this;

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
			this.keyboard
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
			this.keyboard
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
			{
				
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
		}
		);
	};
}

export { Board, BoardConfigs, LETTER_STATUS };
