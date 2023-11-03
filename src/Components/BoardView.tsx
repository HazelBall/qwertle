import React from "react";
import { Board } from "../model/board";
import BoardLetter from "./BoardLetter";

const BoardView = (props: { board: Board }) => {
	let board = props.board;
	return (
		<div className="board-view">
			{board.attempts.map((row, i) => {
				return (
					<div className="game-row" key={i}>
						{row.map((letter, j) => {
							return letter ? (
								<BoardLetter
									key={"guess-" + j}
									letter={letter}
								/>
							) : (
								<span
									key={"guess-" + j}
									className="guess-letter"
								>
									<img src = "../../public/hex-default.svg"></img>
								</span>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default BoardView;
