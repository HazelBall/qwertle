import React from "react";

enum LetterStatus {
	Untyped,
	Incorrect,
	Misplaced,
	Correct,
}

const Letter = (props: {
	letter: string;
	isDisabled: boolean;
	status: LetterStatus;
}) => {
	return (
		<input
			className={
				"keyboard-letter " + LetterStatus[props.status].toLowerCase()
			}
			type="button"
			disabled={props.isDisabled}
			value={props.letter}
		/>
	);
};

export { Letter, LetterStatus };
