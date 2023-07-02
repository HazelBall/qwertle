import React from "react";
import { Key } from "./Key";
import { LETTER_STATUS, KEYBOARD_SPACER, Letter } from "../model/letter";
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
	const keyboardLayout = props.board.configs.keyboardLayout;
	const keyboard = props.board.keyboard;
	console.log(keyboard);
	console.log(props.board.currentLetter);
	return (
		<div className="keyboard">
			{keyboardLayout.layout.map((keyboardRow, i) => (
				<div key={keyboardRow.join()} className="keyboard-row">
					{keyboardRow.map((key, i) =>
						key === KEYBOARD_SPACER ? (
							<span
								className={"keyboard-spacer"}
								style={{ padding: "10px" }}
								key={key + "" + i}
							></span>
						) : !keyboard.has(key) ? (
							<span>Broken</span>
						) : (
							<Key
								key={"letter" + key}
								letter={keyboard.get(key)}
								addLetter={props.addLetter}
							/>
						)
					)}
				</div>
			))}
		</div>
	);
};

export default Keyboard;
