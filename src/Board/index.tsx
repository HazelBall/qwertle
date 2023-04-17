import React, { useState, useEffect } from "react";
import { Board, BoardConfigs, LETTER_TYPES } from "../model/board";

enum GameState {
	ONGOING,
	WON,
	LOST,
}

const BoardView = (props: {
	word?: string;
	allowedAttempts?: number;
	finishGame: (state: GameState) => void;
}) => {
	const [currentGuess, setCurrentGuess] = useState("");
	const [board, setBoard] = useState(new Board(new BoardConfigs()));

	useEffect(() => {
		if (props.word !== undefined) {
			var configs = new BoardConfigs(
				props.word,
				props.word.length,
				props.allowedAttempts
			);
			setBoard(new Board(configs));
		}
		document.addEventListener("keyup", logLetter, true);
	}, []);

	const logLetter = (e: KeyboardEvent) => {
		addLetter(e.key);
	};

	const addLetter = (letter: string) => {
		if (
			"abcdefghijklmnopqrstuvwxyz".includes(letter) &&
			!currentGuess.includes(letter)
		) {
			setCurrentGuess((prevState) => prevState + letter);
		}
	};

	const removeLetter = () => {
		setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
	};

	const submitGuess = () => {
		//TODO
	};

	return (
		<div>
			{board.word}
			<input readOnly value={currentGuess} />
		</div>
	);
};

export { BoardView, GameState };
