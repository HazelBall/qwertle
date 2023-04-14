import React, { useState } from "react";

enum GameState {
	ONGOING,
	WON,
	LOST,
}

const BoardView = (props: {
	word: string;
	finishGame: (state: GameState) => any;
}) => {
	const [currentGuess, setCurrentGuess] = useState("");

	const addLetter = (letter: string) => {
		if (!currentGuess.includes(letter)) return false;
		setCurrentGuess(currentGuess + letter);
	};

	const removeLetter = () => {};

	return <div>index</div>;
};

export { BoardView, GameState };
