import React, { useState, useEffect, KeyboardEvent } from "react";
import "./App.css";
import Keyboard from "./Components/Keyboard";

function App() {
	return (
		<div className="App">
			<h1>QWERTLE</h1>
			<h2>Your Worst Nightmare</h2>
			<Keyboard />
		</div>
	);
}

export default App;
