enum LETTER_STATUS {
	DEFAULT,
	INCORRECT,
	MISPLACED,
	CORRECT,
}
const KEYBOARD_SPACER = "_";

class Letter {
	letter: string;
	isValidLetter: boolean;
	status: LETTER_STATUS;

	constructor(
		letter: string,
		isValidLetter: boolean = false,
		status: LETTER_STATUS = LETTER_STATUS.DEFAULT
	) {
		this.letter = letter;
		this.isValidLetter = isValidLetter;
		this.status = status;
	}

	/**
	 * Returns a new version of the letter with the updated status
	 * @param status the new status to give to the letter object
	 * @returns new Letter object copied from the current, with the new status.
	 */
	updateStatus = (status: LETTER_STATUS) => {
		return new Letter(this.letter, this.isValidLetter, status);
	};

	/**
	 * Updates whether the letter is a valid next guess, and returns a new object if changed.
	 * @param isValidLetter boolean
	 * @returns current letter object if validity doesn't change, or a new Letter object with the new validity.
	 */
	updateValidity = (isValidLetter: boolean) => {
		return isValidLetter === this.isValidLetter
			? this
			: new Letter(this.letter, isValidLetter, this.status);
	};
}

export { Letter, LETTER_STATUS, KEYBOARD_SPACER };
