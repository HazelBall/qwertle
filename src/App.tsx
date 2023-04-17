import React, { useState, useEffect, KeyboardEvent } from "react";
import "./App.css";

import { BoardView, GameState } from "./Board";

function App() {
	return (
		<div className="App">
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
