import React from "react";
import { Letter } from "./Letter";
import { LETTER_STATUS, KEYBOARD_SPACER } from "../model/letter";
import { LETTER_MAPS } from "../model/lettermaps";

const Keyboard = (props: { addLetter: (letter: string) => void }) => {
	/* ADD THIS ONCE FUNCTIONING
    props: {
	onKeyPress: (letter: string) => void;
	keyStates: { key: string; state: {} };
    }
    */
	const keyboard = LETTER_MAPS.QWERTY.layout;
	return (
		<div className="keyboard">
			{keyboard.map((keyboardRow, i) => (
				<div key={keyboardRow.join()} className="keyboard-row">
					{keyboardRow.map((key, i) =>
						key !== KEYBOARD_SPACER ? (
							<Letter
								key={"letter" + key}
								letter={key}
								isDisabled={false}
								status={LETTER_STATUS.CORRECT}
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
