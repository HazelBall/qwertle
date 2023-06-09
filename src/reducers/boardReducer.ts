import { Board } from "../model/board";

enum BOARD_ACTIONS {
	ADD_LETTER,
	DELETE_LETTER,
	CLEAR_GUESS,
	SUBMIT_GUESS,
}

const boardReducer = (board: Board, action: BOARD_ACTIONS) => {
	switch (action) {
		case BOARD_ACTIONS.ADD_LETTER:
			return;
		case BOARD_ACTIONS.DELETE_LETTER:
			return;
		case BOARD_ACTIONS.CLEAR_GUESS:
			return;
		case BOARD_ACTIONS.SUBMIT_GUESS:
			return;
	}
};
