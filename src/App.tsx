import React, { useState, useReducer } from "react";
import "./styles/App.css";
import Keyboard from "./Components/Keyboard";
import { BOARD_ACTIONS, boardReducer } from "./reducers/boardReducer";
import { Board, BoardConfigs, GAME_STATE } from "./model/board";
import BoardView from "./Components/BoardView";
import EndModal from "./Components/EndModal";

function App() {
	const [board, dispatch] = useReducer(
		boardReducer,
		new Board(new BoardConfigs())
	);

	var guess = "";
	if (board.currentAttempt < board.configs.allowedAttempts)
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
			<BoardView board={board} />
			<dialog open = {board.state !== GAME_STATE.IN_PROGRESS} >
				<EndModal board={board}/>
			</dialog><EndModal board={board}/>
			
			{board.state === GAME_STATE.IN_PROGRESS
				&& <h3>{"Current Guess: " + guess}</h3>
			}
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
				disabled={board.currentLetter === 0}
			/>
			<input
				type="button"
				value="Submit"
				onClick={() => {
					dispatch({
						type: BOARD_ACTIONS.SUBMIT_GUESS,
						payload: {},
					});
				}}
				disabled={!board.canSubmit}
			/>
			{/*
			<input type="button" value="Enter" />
			*/}
		</div>
	);
}

export default App;
