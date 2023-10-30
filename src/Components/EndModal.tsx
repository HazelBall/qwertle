import React from 'react'
import { Board, GAME_STATE } from '../model/board';
import {SavedStats, GameStats} from '../model/savedStats';

const EndModal = (props:{board:Board}) => {
    let board = props.board;

    var savedStatsString = localStorage.getItem("savedStats");

    var savedStats:SavedStats = savedStatsString 
        ? JSON.parse(savedStatsString)
        : savedStats = new SavedStats(0, []);

    if(board.state != GAME_STATE.IN_PROGRESS) {
        let newStreak = board.state === GAME_STATE.WON && savedStats.isStreakValid()
            ? savedStats.previousStreak + 1 : 1;
        
        savedStats = savedStats.updateStats(savedStats.previousStreak + 1, new GameStats(new Date(Date.now()), board.state, board.currentAttempt + 1))
    }

    return (
        <>
            <div className="modal">
                {board.state === GAME_STATE.WON && <h1>YOU WON!</h1>}
                {board.state === GAME_STATE.LOST && <h1>YOU LOST!</h1>}
                <p>{board.state !== GAME_STATE.IN_PROGRESS && savedStats.previousCompletions[savedStats.previousCompletions.length - 1].state}</p>
            </div>
        </>
    )
}

export default EndModal