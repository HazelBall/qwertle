import { GAME_STATE } from "./board";


class SavedStats {
    previousStreak: number;
    previousCompletions:[{date:Date, state:GAME_STATE, guesses:number}];
    constructor(
        previousStreak:number,
        previousCompletions:[{date:Date, state:GAME_STATE, guesses:number}]
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

}