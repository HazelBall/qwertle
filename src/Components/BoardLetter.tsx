import React from "react";
import { LETTER_STATUS, Letter } from "../model/letter";

const BoardLetter = (props: { letter: Letter }) => {
	let letter = props.letter;
	let classes = "guess-letter";
	classes =
		letter.status === LETTER_STATUS.DEFAULT
			? classes
			: classes + " " + LETTER_STATUS[props.letter.status].toLowerCase();

	return <input 
		disabled 
		className={classes}
		value={letter.letter}></input>;
};

export default BoardLetter;
