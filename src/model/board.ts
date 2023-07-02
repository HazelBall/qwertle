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
 * # Board
 * Represents the data for the current game the user is playing. All state-managed data is stored in this object, including:
 *  - The correct sequence
 *  - The user's chosen keyboard layout
 *  - The attempts the user has made
 *  - The current attempt the user is making
 *  - The status of each letter on the keyboard and in submitted attempts
 */
class Board {
	configs: BoardConfigs;
	currentAttempt: number;
	currentLetter: number;
	attempts: (Letter | null)[][];
	keyboard: Map<string, Letter>;
	canSubmit: boolean;
	isWon: boolean;

	/**
	 * Board constructor, which takes in optional configurations and board data
	 * including attempt and letter indices, attempts, and keyboard status.
	 *
	 * If no configurations are given, the board uses default test
	 * configurations. If no board data is given, the board creates new blank
	 * data, indicating the game has not yet started.
	 *
	 * When given data, the board automatically looks for any needed updates to
	 * statuses, as to simplify state management. For example, the board
	 * updates the keyboard's validities upon each construction, as to maintain
	 * them with updates to the attempt data. Additionally, the
	 *
	 * @example
	 *      //Creates a new board with default configurations
	 *      new Board();
	 * @example
	 *      //Creates a new board with specified configurations and no data
	 *      new Board(configs);
	 * @example
	 *      //Creates a new board with specified configurations and data
	 *      new Board(configs, 0, 2, updatedAttempts, keyboard);
	 *
	 * @param configs
	 * 		optional BoardConfigs object for the board, or null if using default configurations.
	 * @param currentAttemptIndex
	 * 		index of the current sequence attempt, 0 based.
	 * @param currentLetterIndex
	 * 		index of the current sequence letter, 0 based.
	 * @param attempts
	 * 		2D array of Letter objects or nulls, representing the current board status
	 * @param keyboard
	 * 		map of Letter objects, keyed to the string letter.
	 */
	constructor(
		configs: BoardConfigs = new BoardConfigs(),
		currentAttempt: number = 0,
		currentLetter: number = 0,
		attempts: null | (Letter | null)[][] = null,
		keyboard: null | Map<string, Letter> = null
	) {
		this.configs = configs;
		this.currentAttempt = currentAttempt;
		this.currentLetter = currentLetter;
		this.isWon = false;

		this.canSubmit = currentLetter >= configs.wordLength;

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
		if (keyboard) {
			this.keyboard = keyboard;
		} else {
			let newKeyboard = new Map<string, Letter>();
			configs.keyboardLayout.map.forEach((value, key) => {
				newKeyboard.set(key, new Letter(key));
			});
			this.keyboard = newKeyboard;
		}
		// Keyboard Validity is calculated on construction so that it will not need to be updated separately in the reducer or Board.
		//this.keyboard = this.setValidity(keyboard);
		let status = this.updateStatuses(this.attempts, this.keyboard);
		if (status) {
			this.attempts = status.attempts;
			this.keyboard = status.keyboard;
		}
		this.keyboard = this.updateValidity(this.keyboard);
	}

	/**
	 * Updates the status of
	 * @param attempts
	 * @param keyboard
	 * @returns
	 */
	updateStatuses = (
		attempts: (Letter | null)[][],
		keyboard: Map<string, Letter>
	): {
		attempts: (Letter | null)[][];
		keyboard: Map<string, Letter>;
	} | null => {
		// Only update the statuses after a new attempt has been submitted.
		if (this.currentLetter !== 0 || this.currentAttempt === 0) {
			return null;
		}

		console.log("Updating Statuses!");

		let newAttempts = [...attempts];
		let newKeyboard = new Map(keyboard);
		newAttempts.forEach((attempt, attemptIndex) => {
			// ! Do not update for attempts that have not been completed.
			if (attemptIndex < this.currentAttempt)
				attempt.forEach((letter, letterIndex) => {
					if (!letter)
						throw new Error(
							"ERROR Updating Statuses: letter " +
								letterIndex +
								"is null"
						);
					let newStatus = this.checkLetter(letter, letterIndex);
					letter.updateStatus(newStatus);
					let keyboardLetter = newKeyboard.get(letter.letter);
					if (keyboardLetter && newStatus > keyboardLetter.status)
						newKeyboard.set(
							letter.letter,
							keyboardLetter.updateStatus(newStatus)
						);
				});
		});
		let isGameWon = true;
		newAttempts[this.currentAttempt - 1].forEach((letter) => {
			if (!letter || letter.status != LETTER_STATUS.CORRECT)
				isGameWon = false;
		});
		this.isWon = isGameWon;
		return { attempts: newAttempts, keyboard: newKeyboard };
	};

	/**
	 *
	 * @param keyboard
	 * @returns
	 */
	updateValidity = (keyboard: Map<string, Letter>): Map<string, Letter> => {
		let newKeyboard = new Map(keyboard);
		// If no letters have been added to the current guess, all letters are valid
		if (this.currentLetter === 0) {
			newKeyboard.forEach((letter, key) => {
				newKeyboard.set(
					key,
					this.isWon
						? letter.updateValidity(false).updateSelection(false)
						: letter.updateValidity(true).updateSelection(false)
				);
			});
			return newKeyboard;
		}

		// Update all letters to invalid unless they
		// - A. are adjacent to the current letter and
		// - B. aren't selected
		let lastLetter =
			this.attempts[this.currentAttempt][this.currentLetter - 1]?.letter;
		if (!lastLetter)
			throw new Error(
				"ERROR updating keyboard validity: last letter is null"
			);
		let adjacentLetters = this.configs.keyboardLayout.map.get(lastLetter);
		if (!adjacentLetters) {
			throw new Error(
				"ERROR updating keyboard validity: no adjacent letters"
			);
		}
		let al: string[] = adjacentLetters;

		newKeyboard.forEach((value, key) => {
			if (
				al.includes(key) &&
				!value.isSelected &&
				this.currentLetter < this.configs.wordLength
			) {
				newKeyboard.set(key, value.updateValidity(true));
			} else {
				newKeyboard.set(key, value.updateValidity(false));
			}
		});
		return newKeyboard;
	};

	/*
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
	*/

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
		letter: string | undefined,
		isSelected: boolean
	): Map<string, Letter> => {
		if (!letter)
			throw new Error("ERROR updating keyboard: letter does not exist");
		let newKeyboard = new Map(this.keyboard);
		let value = newKeyboard.get(letter);
		return value instanceof Letter
			? newKeyboard.set(letter, value.updateSelection(isSelected))
			: this.keyboard;
	};

	/**
	 * Returns a new board object with the added letter, or the same object if the current guess has reached the word length.
	 * @param newLetter new string letter (e.g. 'a')
	 * @returns new Board object
	 */
	addLetter = (newLetter: string) => {
		if (this.canSubmit) return this;
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

		let deletedLetter =
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
			this.updateKeyboardSelection(deletedLetter?.letter, false)
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
			this.keyboard
		);
	};
}

export { Board, BoardConfigs, LETTER_STATUS };
