import React from "react";

const keyboard = () => {
	/* ADD THIS ONCE FUNCTIONING
    props: {
	onKeyPress: (letter: string) => void;
	keyStates: { key: string; state: {} };
    }
    */
	const keyboard = [
		["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
		["a", "s", "d", "f", "g", "h", "j", "k", "l"],
		["z", "x", "c", "v", "b", "n", "m"],
	];
	return (
		<div>
			{keyboard.map((keyboardRow, i) => {
				return (
					<div className="keyboard-row">
						{keyboardRow.map((key, i) => {
							return <div className="keyboard-key">{key}</div>;
						})}
					</div>
				);
			})}
		</div>
	);
};

export default keyboard;
