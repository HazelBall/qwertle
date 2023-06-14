import React from "react";
import { LETTER_STATUS, Letter } from "../model/letter";

const Key = (props: {
	letter: Letter;
	addLetter: (letter: string) => void;
}) => {
	let letter = props.letter;
	let classes = "keyboard-letter";
	classes =
		letter.status === LETTER_STATUS.DEFAULT
			? classes
			: classes + " " + LETTER_STATUS[props.letter.status].toLowerCase();
	classes = letter.isSelected ? classes + " selected" : classes;

	return (
		<input
			className={classes}
			type="button"
			disabled={!props.letter.isValidLetter}
			value={props.letter.letter}
			onClick={() => props.addLetter(props.letter.letter)}
		/>
	);
};

export { Key };
