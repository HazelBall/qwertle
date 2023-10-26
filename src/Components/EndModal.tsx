import React from 'react'
import { Board, GAME_STATE } from '../model/board'

const EndModal = (props:{board:Board}) => {
    let board = props.board;
    return (
        <>
            <div className="modal">
                {board.state === GAME_STATE.WON && <h1>YOU WON!</h1>}
                {board.state === GAME_STATE.LOST && <h1>YOU LOST!</h1>}
            </div>
        </>
    )
}

export default EndModal