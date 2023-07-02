import { Board } from "../model/board";

enum BOARD_ACTIONS {
	ADD_LETTER,
	DELETE_LETTER,
	CLEAR_GUESS,
	SUBMIT_GUESS,
}

/**
 * Reducer for the QWERTLE game board, with all possible actions taken during the game.
 * @param board
 * @param action
 * @returns
 */
const boardReducer = (
	board: Board,
	action: { type: BOARD_ACTIONS; payload: { letter?: string } }
) => {
	switch (action.type) {
		case BOARD_ACTIONS.ADD_LETTER: {
			if (!action.payload.letter)
				throw new Error(
					"Error with ADD_LETTER: No letter given by payload)"
				);
			let guess = "";
			for (let l of board.attempts[board.currentAttempt])
				guess += l ? l.letter : "";
			return board.addLetter(action.payload.letter);
		}
		case BOARD_ACTIONS.DELETE_LETTER: {
			return board.removeLetter();
		}
		case BOARD_ACTIONS.CLEAR_GUESS: {
			return board.clearGuess();
		}
		case BOARD_ACTIONS.SUBMIT_GUESS: {
			return board.submitGuess();
		}
		default: {
			throw new Error(
				"Unknown action: " +
					action.type +
					"/" +
					BOARD_ACTIONS[action.type]
			);
		}
	}
};

export { BOARD_ACTIONS, boardReducer };
