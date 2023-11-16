enum LETTER_STATUS {
	DEFAULT,
	INCORRECT,
	MISPLACED,
	CORRECT,
}
enum HEX_SOURCE {
	DEFAULT = "/hex-default.svg",
	INCORRECT = "/hex-incorrect.svg",
	MISPLACED = "/hex-misplaced.svg",
	CORRECT = "/hex-correct.svg",
	SELECTED = "/hex-selected.svg"
}
const KEYBOARD_SPACER = "_";

/**
 * Class representing a letter, either on the keyboard or guessed by the user. It contains information about
 * the actual letter, whether it's valid to play next, and the status of the letter.
 *
 * When used by the keyboard, the letters display their highest
 */
class Letter {
	letter: string;
	isValidLetter: boolean;
	isSelected: boolean;
	status: LETTER_STATUS;

	constructor(
		letter: string,
		isValidLetter: boolean = true,
		status: LETTER_STATUS = LETTER_STATUS.DEFAULT,
		isSelected: boolean = false
	) {
		this.letter = letter;
		this.isValidLetter = isValidLetter;
		this.status = status;
		this.isSelected = isSelected;
	}

	/**
	 * Returns a new version of the letter with the updated status
	 * @param status the new status to give to the letter object
	 * @returns new Letter object copied from the current, with the new status.
	 */
	updateStatus = (status: LETTER_STATUS) => {
		return new Letter(
			this.letter,
			this.isValidLetter,
			status,
			this.isSelected
		);
	};

	/**
	 * Updates whether the letter is a valid next guess, and returns a new object if changed.
	 * @param isValidLetter boolean
	 * @returns current letter object if validity doesn't change, or a new Letter object with the new validity.
	 */
	updateValidity = (isValidLetter: boolean) => {
		return isValidLetter === this.isValidLetter
			? this
			: new Letter(
					this.letter,
					isValidLetter,
					this.status,
					this.isSelected
			  );
	};

	updateSelection(isSelected: boolean) {
		return new Letter(
			this.letter,
			this.isValidLetter,
			this.status,
			isSelected
		);
	}
}

export { Letter, LETTER_STATUS, KEYBOARD_SPACER, HEX_SOURCE };
