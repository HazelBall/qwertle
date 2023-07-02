import React from "react";
import { LETTER_STATUS, Letter } from "../model/letter";

const BoardLetter = (props: { letter: Letter }) => {
	let letter = props.letter;
	let classes = "guess-letter";
	classes =
		letter.status === LETTER_STATUS.DEFAULT
			? classes
			: classes + " " + LETTER_STATUS[props.letter.status].toLowerCase();

	return <span className={classes}>{letter.letter}</span>;
};

export default BoardLetter;
