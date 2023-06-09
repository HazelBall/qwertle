import React from "react";
import { LETTER_STATUS } from "../model/letter";

const Letter = (props: {
	letter: string;
	isDisabled: boolean;
	status: LETTER_STATUS;
	addLetter: (letter: string) => void;
}) => {
	return (
		<input
			className={
				"keyboard-letter " + LETTER_STATUS[props.status].toLowerCase()
			}
			type="button"
			disabled={props.isDisabled}
			value={props.letter}
			onClick={() => props.addLetter(props.letter)}
		/>
	);
};

export { Letter };
