import React from "react";
import { Key } from "./Key";
import { LETTER_STATUS, KEYBOARD_SPACER } from "../model/letter";
import { LETTER_MAPS } from "../model/lettermaps";
import { Board } from "../model/board";

const Keyboard = (props: {
	board: Board;
	addLetter: (letter: string) => void;
}) => {
	/* ADD THIS ONCE FUNCTIONING
    props: {
	onKeyPress: (letter: string) => void;
	keyStates: { key: string; state: {} };
    }
    */
	const keyboard = props.board.keyboard;
	return (
		<div className="keyboard">
			{keyboard.map((keyboardRow, i) => (
				<div key={keyboardRow.join()} className="keyboard-row">
					{keyboardRow.map((key, i) =>
						key.letter !== KEYBOARD_SPACER ? (
							<Key
								key={"letter" + key.letter}
								letter={key}
								addLetter={props.addLetter}
							/>
						) : (
							<span
								className={"keyboard-spacer"}
								style={{ padding: "10px" }}
								key={key + "" + i}
							></span>
						)
					)}
				</div>
			))}
		</div>
	);
};

export default Keyboard;
