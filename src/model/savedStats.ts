import { GAME_STATE } from "./board";

/**
 * 
 */
class GameStats {
    date:Date;
    state:GAME_STATE;
    guesses:Number;

    constructor(date:Date, state:GAME_STATE, guesses:Number) {
        this.date = date;
        this.state = state;
        this.guesses = guesses;
    }
}

/**
 * 
 */
class SavedStats {
    previousStreak: number;
    previousCompletions:GameStats[];
    constructor(
        previousStreak:number,
        previousCompletions:GameStats[]
    ) {
        this.previousStreak = previousStreak;
        this.previousCompletions = previousCompletions;
    }

    /**
     * 
     * @returns Boolean whether the streak was held yesterday.
     */
    isStreakValid() {
        let yesterdaysDate = new Date( Date.now() - 24*60*60*1000 );
        for(let completion of this.previousCompletions) {
            if(completion.date.getFullYear() === yesterdaysDate.getFullYear()
                && completion.date.getMonth() === yesterdaysDate.getMonth()
                && completion.date.getDay() === yesterdaysDate.getDay())
                return true;
        }
        return false;
    }

    /**
     * 
     * @param newStreak 
     * @param newCompletion 
     * @returns 
     */
    updateStats(newStreak:number, newCompletion:GameStats) {
        return new SavedStats(newStreak, [...this.previousCompletions, newCompletion])
    }

}

export {SavedStats, GameStats};