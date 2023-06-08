import React from "react";
import { Letter, LetterStatus } from "./Letter";

const Keyboard = () => {
	/* ADD THIS ONCE FUNCTIONING
    props: {
	onKeyPress: (letter: string) => void;
	keyStates: { key: string; state: {} };
    }
    */
	const keyboard = [
		["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
		["a", "s", "d", "f", "g", "h", "j", "k", "l"],
		["z", "x", "c", "v", "b", "n", "m", "spacer"],
	];
	return (
		<div>
			{keyboard.map((keyboardRow, i) => (
				<div key={keyboardRow.join()} className="keyboard-row">
					{keyboardRow.map((key) =>
						key !== "spacer" ? (
							<Letter
								key={"letter" + key}
								letter={key}
								isDisabled={false}
								status={LetterStatus.Correct}
							/>
						) : (
							<span
								className="keyboard-spacer"
								style={{ padding: "10px" }}
								key={key}
							></span>
						)
					)}
				</div>
			))}
		</div>
	);
};

export default Keyboard;
