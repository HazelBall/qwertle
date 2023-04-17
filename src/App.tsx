import React, { useState, useEffect, KeyboardEvent } from "react";
import "./App.css";

import { BoardView, GameState } from "./Board";

function App() {
	const [currentGuess, setCurrentGuess] = useState("");

	const log = (e: KeyboardEvent): void => {
		console.log(e.key);
	};

	return (
		<div className="App" onKeyUp={(e) => log(e)} tabIndex={-1} autoFocus>
			<h1>QWERTLE</h1>
			<h2>Your Worst Nightmare</h2>
			<BoardView
				word={"quiz"}
				finishGame={(state: GameState): void => {
					console.log("Game Finished!" + state);
				}}
			/>
		</div>
	);
}

export default App;
