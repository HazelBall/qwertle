import React from "react";
import { LETTER_STATUS, Letter, HEX_SOURCE } from "../model/letter";



const Key = (props: {
	letter?: Letter;
	addLetter: (letter: string) => void;
}) => {
	if (props.letter === undefined) return <span>Broken</span>;
	let letter = props.letter;
	let classes = "keyboard-letter";
	classes =
		letter.status === LETTER_STATUS.DEFAULT
			? classes
			: classes + " " + LETTER_STATUS[props.letter.status].toLowerCase();
	classes = letter.isSelected ? classes + " selected" : classes;

	const getHexSource = () => {
		if(props.letter === undefined) return HEX_SOURCE.DEFAULT
		else if(props.letter.isSelected) return HEX_SOURCE.SELECTED
		else if(props.letter.status === LETTER_STATUS.DEFAULT) return HEX_SOURCE.DEFAULT
		else if(props.letter.status === LETTER_STATUS.CORRECT) return HEX_SOURCE.CORRECT
		else if(props.letter.status === LETTER_STATUS.MISPLACED) return HEX_SOURCE.MISPLACED
		else if(props.letter.status === LETTER_STATUS.INCORRECT) return HEX_SOURCE.INCORRECT;
	}

	return (
		<span className={classes}>
			<img src = {getHexSource()} className = "hexagon"/>
			<input type = "button" disabled={!props.letter.isValidLetter}
				value = {props.letter.letter}
				onClick={() => props.addLetter(letter.letter)}/>
		</span>
	);
};

export { Key };
