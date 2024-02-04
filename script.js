const NUM_GUESSES = 7, 
	NUM_LETTERS = 4,
	ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var currentGuess = 0, currentLetter = 0;

var guessed = false;

var gameBoard = document.getElementById("board");

var streakW, streakL;

var inputs = [];
var date;
var letters = {};
var keys = {};
for(i = 0; i < ALPHABET.length; i ++) {
	letters[ALPHABET.charAt(i)] = 0;
	keys[ALPHABET.charAt(i)] = document.getElementById(ALPHABET.charAt(i));
}


var d = new Date();
var date = "" + d.getFullYear() + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2);
Math.seedrandom(date);

var word = "";
for(let i = 0; i < NUM_LETTERS; i ++) {
	var newLetter = ALPHABET.charAt(Math.floor(Math.random() * 26));
	while(word.includes(newLetter)) {
		newLetter = ALPHABET.charAt(Math.floor(Math.random() * 26));
	}
	word += newLetter;
}

for(let i = 0; i < NUM_GUESSES; i ++) {
	var row = document.createElement('div');
	row.classList.add("row");
	var inputRow = [];
	for(j = 0; j < NUM_LETTERS; j ++) {
		var e = document.createElement('input');
		e.classList.add("letter");
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
	// Make sure the streaks cache is initialized.
	streakW = localStorage.getItem("streakWin");
	if(streakW === null) {
		localStorage.setItem("streakWin", "0")
		streakW = "0";
	}
	streakL = localStorage.getItem("streakLose");
	if(streakL === null) {
		localStorage.setItem("streakLose", "0")
		streakL = "0";
	}
	var lastDate = localStorage.getItem("lastDate");
	if(lastDate != null && lastDate === date) {
		var i = 0;
		var attemptedGuess = true;
		while( i < NUM_GUESSES && attemptedGuess) {
			var guess = localStorage.getItem("attempt-" + i);
			if(guess != null) {
				for(j = 0; j < NUM_LETTERS; j ++) {
					inputs[i][j].value = guess.charAt(j);
				}
				analyzeGuess(i, true);
				currentGuess ++;
			} else {
				attemptedGuess = false;
			}
			i++
		}
	}
	if(localStorage.getItem("advertisement") === null) {
		toggleModal("advertisement");
		localStorage.setItem("advertisement", date);
	}
}

function addLetter(l) {
	if (currentLetter < NUM_LETTERS && !guessed) {
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
	if (currentLetter >= NUM_LETTERS && !guessed) {
		analyzeGuess(currentGuess, false);
		guess = "";
		for(i = 0; i < NUM_LETTERS; i ++) guess += inputs[currentGuess][i].value;
		localStorage.setItem("lastDate", date);
		localStorage.setItem("attempt-" + currentGuess, guess)
        currentGuess ++;
        currentLetter = 0;
    }
}


function analyzeGuess(guess, past) {
	var numCorrect = 0;
	var pastGuesses = ""
	for(let i = 0; i < NUM_LETTERS; i ++) {
		if(inputs[guess][i].value == word.charAt(i)) {
			pastGuesses += word.charAt(i)
			inputs[guess][i].classList.toggle("right");
			numCorrect ++;
			letters[inputs[guess][i].value] = 2;
		}
	}
	for(let i = 0; i < NUM_LETTERS; i ++) {
		if(word.includes(inputs[guess][i].value) && 
				!pastGuesses.includes(inputs[guess][i].value)) {
			inputs[guess][i].classList.toggle("close");
			pastGuesses += inputs[guess][i].value;
			if (letters[inputs[guess][i].value] != 2) {
				letters[inputs[guess][i].value] = 1;
			}
		} else {
			pastGuesses += inputs[guess][i].value;
			if (letters[inputs[guess][i].value] <=0) {
				inputs[guess][i].classList.toggle("wrong");
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
		
		if(!past) {
			streakL = "0";
			localStorage.setItem("streakLose", "0");
			
			var newWinStreak = Number(streakW) + 1;
			streakW = String(newWinStreak)
			localStorage.setItem("streakWin", String(streakW));
		}
		toggleWinModal();
		
	} else if(currentGuess === NUM_GUESSES - 1) {
		guessed = true;
		
		if(!past) {
			streakW = "0";
			localStorage.setItem("streakWin", "0");
			
			var newLoseStreak = Number(streakL) + 1;
			streakL = String(newLoseStreak)
			localStorage.setItem("streakLose", String(streakL));
		}
		toggleLoseModal();
	}
}

var attempts = "";

function shareAttempts() {
	var shareDate = ( "0" + (d.getMonth()+1) ).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
	var ret =  "#Qwertle " + shareDate + ":\n" + attempts
	if (navigator.share) {
  		// Web Share API is supported
  		navigator.share({
      		title: 'Qwertle Score',
      		text: ret,
      		url: 'https://qwertle.com'
    	}).catch(() => {
			alert("something went wrong");
		  });
	} else {
  		// Fallback
  		navigator.clipboard.writeText(ret)
			.then(() => {
				alert("successfully copied");
		  	})
		  	.catch(() => {
				alert("something went wrong");
		  	});;
	}
}
 
function toggleWinModal() {
	document.getElementById("modalHeading").innerHTML = "Congratulations!";
	document.getElementById('streak').innerHTML = "You have won "  + streakW + " times in a row!";
	attempts = printAttempts();
	var attemptArr = attempts.split("\n");
	var fullAttempt = "";
	for(var s = 0; s < attemptArr.length; s++) {
		fullAttempt += attemptArr[s];
		if(s != attemptArr.length -1) fullAttempt += "<br>";
	}
	document.getElementById("attempts").innerHTML = fullAttempt;
	getTime();
	toggleModal("end");
}
 
function toggleLoseModal() {
	document.getElementById("modalHeading").innerHTML = "Today's Letters: " + word;
	document.getElementById('streak').innerHTML = "You have lost " + streakL + " times in a row!";
	attempts = printAttempts();
	var attemptArr = attempts.split("\n");
	var fullAttempt = "";
	for(var s = 0; s < attemptArr.length; s++) {
		fullAttempt += attemptArr[s];
		if(s != attemptArr.length -1) fullAttempt += "<br>";
	}
	document.getElementById("attempts").innerHTML = fullAttempt;
	getTime();
	toggleModal("end");
}

/**
	Green Box: 	&#129001;
	Yellow Box: &#129000;
	Gray Box:	&#11036;
	New Line:	&#10;
 */

function printAttempts() {
	var ret = [];
	for(let i = 0; i <=currentGuess; i ++) {
		temp = []
		for(var j = 0; j <= NUM_LETTERS; j++) {
			if(j === NUM_LETTERS && i != currentGuess) {
				temp.push("\n");
			} else {
				temp.push("");
			}
		}
		ret.push(temp);
	}
	for(let i = 0; i <=currentGuess; i++) {
		var pastGuesses = "";
		for(j = 0; j < NUM_LETTERS; j ++) {
			if(inputs[i][j].value == word.charAt(j)) {
				pastGuesses += word.charAt(i)
				ret[i][j] = "🟩";
			}
		}
		for(j = 0; j < NUM_LETTERS; j ++) {
			if(word.includes(inputs[i][j].value) && 
					!pastGuesses.includes(inputs[i][j].value)) {
				pastGuesses += inputs[i][j].value;
				if (ret[i][j] != "🟩") {
					ret[i][j] = "🟨";
				}
			} else {
				if (ret[i][j] === "") {
					ret[i][j] = "⬜";
				}
			}
		}
	}
	val = "";
	for(let i = 0; i <= currentGuess; i++) {
		for(j = 0; j <= NUM_LETTERS; j++) {
			val += ret[i][j]
		}
	}
	return val;
	
}

function getTime() {
	var x = setInterval(function() {
	  	// Get today's date and time
	  	const today = new Date()
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0,0,0,0);
		
	  	var now = new Date().getTime();
	
	  	// Find the distance between now and the count down date
	  	var distance = tomorrow - now;
	
	  	// Time calculations for days, hours, minutes and seconds
	  	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	  	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	  	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	  	// Display the result in the element with id="demo"
	  	var time = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
	  	document.getElementById("qwertleTime").innerHTML = time;
	}, 1000);
}
 

function toggleModal(id) {
	var modal = document.getElementById(id);
	modal.open ? modal.close()
		: modal.showModal();
}

function changeLetter(element) {
	let l = ALPHABET.charAt(Math.floor(Math.random() * 26));
	element.innerHTML = l;
	if(word[0] == l) {
		element.classList.add("right");

	} else {
		element.classList.remove("right");
	}
}

let darkMode = localStorage.getItem("darkMode");
if(darkMode === "enabled") {
	document.body.classList.add("darkMode");
}

const toggleDarkMode = () => {
	let darkModePreference = document.body.classList.toggle("darkMode")
		? "enabled"
		: "disabled";
	localStorage.setItem("darkMode", darkModePreference);
}