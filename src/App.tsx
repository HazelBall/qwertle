import React, { useState, useReducer } from "react";
import "./App.css";
import Keyboard from "./Components/Keyboard";
import { BOARD_ACTIONS, boardReducer } from "./reducers/boardReducer";
import { Board, BoardConfigs } from "./model/board";

function App() {
	const [board, dispatch] = useReducer(
		boardReducer,
		new Board(new BoardConfigs())
	);
	var guess = "";
	board.attempts[board.currentAttempt].forEach((value) => {
		guess += value ? value.letter : "";
	});

	const handleAddLetter = (letter: string) => {
		dispatch({
			type: BOARD_ACTIONS.ADD_LETTER,
			payload: { letter: letter },
		});
	};

	return (
		<div className="App">
			<h1>QWERTLE</h1>
			<h2>Your Worst Nightmare</h2>
			{board.attempts.map((row, i) => {
				return (
					<div className="game-row" key={i}>
						{row.map((letter, j) => {
							return (
								<span
									key={"guess-" + j}
									className="guess-letter"
								>
									{letter ? letter.letter : " "}
								</span>
							);
						})}
					</div>
				);
			})}
			<h3>{"Current Guess: " + guess}</h3>
			<Keyboard board={board} addLetter={handleAddLetter} />

			<input
				type="button"
				value="⌫"
				onClick={() => {
					dispatch({
						type: BOARD_ACTIONS.DELETE_LETTER,
						payload: {},
					});
				}}
			/>
			{/*
			<input type="button" value="Enter" />
			*/}
		</div>
	);
}

export default App;
