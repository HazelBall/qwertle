import { LETTER_MAPS, Layout } from "./lettermaps"
import seedrandom from "seedrandom";

const getSeed = () => {
    var d = new Date();
    var date = "" + d.getFullYear() + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2);
    return date;
}

// returns empty array if not possible
const chooseGuessHelper:(layout:Layout, previousLetters:string[])=>string[] 
    = (layout, previousLetters) => {
    // If no letter is chosen, choose a completely random letter
    // if there are previous letters:
        // get last letter
        // choose a random letter connected to it
        // see if that letter has connected letters that are valid. if not, choose new random letter
        // return recursive of this function
    if(previousLetters.length === 0) {
        console.log("\tFIRST LETTER CHOOSING")
        
        let row = Math.floor(Math.random() * layout.layout.length);
        let column = Math.floor(Math.random() * layout.layout[row].length);
        let letter = layout.layout[row][column];

        console.log("\t\tNew Letter: " + letter);
        let guess = chooseGuessHelper(layout, [letter]);
        return guess;
        
    } else {
        //End recursion if total length is found.
        if(previousLetters.length === 4) {
            console.log("All Letters Chosen");
            return previousLetters;
        }
        console.log("\tNEXT LETTER CHOOSING");
        let wrongOptions = "";

        
        let lastLetter = previousLetters[previousLetters.length - 1];
        let newLetterOptions = layout.map.get(lastLetter);
        console.log("\t\tOPTIONS:");
        console.log(newLetterOptions);
        
        if(!newLetterOptions) return []
        var newLetter = newLetterOptions[Math.floor(Math.random() * newLetterOptions.length)]
        console.log("\t\tNew Letter: " + newLetter);
        while(wrongOptions.includes(newLetter) || previousLetters.includes(newLetter)) {
            wrongOptions += newLetter;
            console.log("\t\tLETTER WRONG");
            newLetter = newLetterOptions[Math.floor(Math.random() * newLetterOptions.length)]
        }
        let newPreviousLetters = [...previousLetters, newLetter]
        return chooseGuessHelper(layout, newPreviousLetters);
       return [];
    }
}

const chooseGuess =(layout:Layout) => {
    seedrandom(getSeed(), { global: true });
    console.log("CHOOSING LETTERS")
    return chooseGuessHelper(layout, [])
}

export default chooseGuess;