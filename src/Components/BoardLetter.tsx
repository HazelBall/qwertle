import React from "react";
import { LETTER_STATUS, Letter, HEX_SOURCE } from "../model/letter";

const BoardLetter = (props: { letter: Letter }) => {
	let letter = props.letter;
	let classes = "guess-letter";
	classes =
		letter.status === LETTER_STATUS.DEFAULT
			? classes
			: classes + " " + LETTER_STATUS[props.letter.status].toLowerCase();

	const getHexSource = () => {
		if(props.letter.status === LETTER_STATUS.DEFAULT) return HEX_SOURCE.DEFAULT
		else if(props.letter.status === LETTER_STATUS.CORRECT) return HEX_SOURCE.CORRECT
		else if(props.letter.status === LETTER_STATUS.MISPLACED) return HEX_SOURCE.MISPLACED
		else if(props.letter.status === LETTER_STATUS.INCORRECT) return HEX_SOURCE.INCORRECT;
	}
	
	return <span className = {classes}>
			<img src = {getHexSource()} className = "hexagon"/>
			<span className="guess-letter--input">{letter.letter}</span>
		</span>
};

export default BoardLetter;
