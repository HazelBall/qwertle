import React, { useState } from "react";
import "./App.css";

import { BoardView, GameState } from "./Board";

function App() {
	const [count, setCount] = useState(0);

	const [currentGuess, setCurrentGuess] = useState("");

	const addLetter = (letter: string) => {
		if (!currentGuess.includes(letter)) return false;
		setCurrentGuess(currentGuess + letter);
	};

	const removeLetter = () => {};

	return <div className="App"></div>;
}

export default App;
