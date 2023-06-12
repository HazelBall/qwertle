import React, { useState, useReducer } from "react";
import "./App.css";
import Keyboard from "./Components/Keyboard";
import { BOARD_ACTIONS, boardReducer } from "./reducers/boardReducer";
import { Board, BoardConfigs } from "./model/board";

function App() {
	const [guess, setGuess] = useState("");
	const [board, dispatch] = useReducer(
		boardReducer,
		new Board(new BoardConfigs())
	);

	const addLetter = (letter: string) => {
		setGuess(guess + letter);
	};

	const handleAddLetter = (letter: string) => {
		dispatch({
			type: BOARD_ACTIONS.ADD_LETTER,
			payload: { letter: letter },
		});
		setGuess(guess + letter);
	};

	return (
		<div className="App">
			<h1>QWERTLE</h1>
			<h2>Your Worst Nightmare</h2>
			<h3>{guess}</h3>
			<Keyboard board={board} addLetter={handleAddLetter} />
		</div>
	);
}

export default App;
