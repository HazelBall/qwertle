import { LETTER_MAPS, Layout } from "./lettermaps"
import seedrandom from "seedrandom";

const getSeed = () => {
    var d = new Date();
    var date = "" + d.getFullYear() + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2);
    return date;
}

// returns empty array if not possible
const chooseGuessHelper:(layout:Layout, seed:seedrandom.PRNG , previousLetters:string[])=>string[] 
    = (layout, seed , previousLetters) => {
    // If no letter is chosen, choose a completely random letter
    // if there are previous letters:
        // get last letter
        // choose a random letter connected to it
        // see if that letter has connected letters that are valid. if not, choose new random letter
        // return recursive of this function
    if(previousLetters.length = 0) {
        let row = Math.floor(seed.quick() * layout.layout.length);
        let column = Math.floor(seed.quick() * layout.layout[row].length);
        let letter = layout.layout[row][column];
        let guess = chooseGuessHelper(layout, seed, [letter]);
        return guess;
        
    } else {
        if(previousLetters.length === 4) return previousLetters;

        let wrongOptions = "";

        let lastLetter = previousLetters[previousLetters.length - 1];
        let newLetterOptions = layout.map.get(lastLetter);
        if(!newLetterOptions) return []
        let newLetter = newLetterOptions[Math.floor(seed.quick() * newLetterOptions.length)]
        while(wrongOptions.includes(newLetter) || previousLetters.includes(newLetter)) {
            let newLetter = newLetterOptions[Math.floor(seed.quick() * newLetterOptions.length)]
        }
        previousLetters.push(newLetter)
        return chooseGuessHelper(layout, seed, previousLetters);
    }
}

const chooseGuess =(chosenLayout:Layout) => {
    let layout = LETTER_MAPS.Layout;
    let rng = seedrandom(getSeed());
    return chooseGuessHelper(layout, rng, [])
}