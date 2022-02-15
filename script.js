var numGuesses = 8, numLetters = 4, currentGuess = 0, currentLetter = 0;

var guessed = false;

let gameBoard = document.getElementById("board");

var inputs = [];

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var letters = {};
var keys = {};
for(i = 0; i < alphabet.length; i ++) {
	letters[alphabet.charAt(i)] = 0;
	keys[alphabet.charAt(i)] = document.getElementById(alphabet.charAt(i));
}

var d = new Date();
var date = "" + d.getFullYear() + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2);
Math.seedrandom(date);

var word = "";
for(i = 0; i < numLetters; i ++) {
	var newLetter = alphabet.charAt(Math.floor(Math.random() * 27));
	while(word.includes(newLetter)) {
		alphabet.charAt(Math.floor(Math.random() * 27));
	}
	word += newLetter;
}

for(i = 0; i < numGuesses; i ++) {
	var row = document.createElement('div');
	var inputRow = [];
	for(j = 0; j < numLetters; j ++) {
		var e = document.createElement('input');
		e.classList.add("letterGuess");
		e.readOnly = true;
		e.maxLength = "1";
		inputRow.push(e);
		row.appendChild(e)
	}
	inputs.push(inputRow);
	gameBoard.appendChild(row);
}
 
document.addEventListener("keyup", function(event) {
	if(!guessed) {
	    if (event.code.substring(0, 3) === "Key") {
			addLetter(event.code.charAt(3))
		} else if (event.code === "Enter") {
			submit();
	    } else if (event.code === "Backspace") {
			removeLetter();
	}
	}
});

function loadAttempts() {
	var attempted = localStorage.getItem(date + "-attempted");
	if(attempted != null) {
		var i = 0;
		var attemptedGuess = true;
		while( i < numGuesses && attemptedGuess) {
			var guess = localStorage.getItem(date + "-" + i);
			if(guess != null) {
				for(j = 0; j < numLetters; j ++) {
					inputs[i][j].value = guess.charAt(j);
				}
				analyzeGuess(i);
				currentGuess ++;
			} else {
				attemptedGuess = false;
			}
			i++
		}
	}
}

function addLetter(l) {
	if (currentLetter < numLetters && !guessed) {
		inputs[currentGuess][currentLetter].value = l;
		currentLetter ++;
	}
}

function removeLetter() {
	if (currentLetter > 0 && !guessed) {
		inputs[currentGuess][currentLetter-1].value = "";
		currentLetter --;
	}
}

function submit() {
	if (currentLetter >= numLetters && !guessed) {
		analyzeGuess(currentGuess);
		guess = "";
		for(i = 0; i < numLetters; i ++) guess += inputs[currentGuess][i].value;
		localStorage.setItem(date + "-attempted", "true");
		localStorage.setItem(date + "-" + currentGuess, guess)
        currentGuess ++;
        currentLetter = 0;
    }
}


function analyzeGuess(guess) {
	var numCorrect = 0;
	var pastGuesses = ""
	for(i = 0; i < numLetters; i ++) {
		if(inputs[guess][i].value == word.charAt(i)) {
			pastGuesses += word.charAt(i)
			inputs[guess][i].classList.toggle("right");
			numCorrect ++;
			letters[inputs[guess][i].value] = 2;
		}
	}
	for(i = 0; i < numLetters; i ++) {
		if(word.includes(inputs[guess][i].value) && 
				!pastGuesses.includes(inputs[guess][i].value)) {
			inputs[guess][i].classList.toggle("close");
			pastGuesses += inputs[guess][i].value;
			if (letters[inputs[guess][i].value] != 2) {
				letters[inputs[guess][i].value] = 1;
			}
		} else {
			inputs[guess][i].classList.toggle("wrong");
			pastGuesses += inputs[guess][i].value;
			if (letters[inputs[guess][i].value] === 0) {
				letters[inputs[guess][i].value] = -1;
			}
		}
	}
	for(const [key, value] of Object.entries(keys)) {
		if (letters[key] == -1) {
			value.classList.add("wrong");
		} else if(letters[key] == 1) {
			value.classList.add("close");
		} else if(letters[key] == 2) {
			value.classList.add("right");
		}
	}
	if(numCorrect === 4) {
		guessed = true;
		toggleWinModal();
	}
}
 
function toggleWinModal() {
	var i =0;
}
 
function toggleModal(id) {
	var modal = document.getElementById(id);
	modal.classList.toggle("open");
}