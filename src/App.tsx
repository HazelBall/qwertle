import React, { useState, useReducer, KeyboardEvent } from "react";
import "./App.css";
import Keyboard from "./Components/Keyboard";

function App() {
	const [guess, setGuess] = useState("");

	const addLetter = (letter: string) => {
		setGuess(guess + letter);
	};

	return (
		<div className="App">
			<h1>QWERTLE</h1>
			<h2>Your Worst Nightmare</h2>
			<h3>{guess}</h3>
			<Keyboard addLetter={addLetter} />
		</div>
	);
}

export default App;
