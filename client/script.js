let guessedWords = [];
let gameStatus = -1;
let randomWord = "";
let firstWord = "";
let isWord;
let currentBotGuess;

// Get the input and submit buttons
const input = document.querySelector("#input");
const submitButton = document.querySelector("#submit");
const board = document.querySelector("#board");
const keyboard = document.querySelector("#keyboard");
// game updates
let userTurn = 0;
let tile = 5;
let gameOver = false;

// Current length used for ensuring backspaces and letter inputs don't cross over (purely visual)
let currentLength = 0;

// these three variables are used in conditionals for the first game provided word and the user inputted words
const atTheStartOfGame = 0;
const firstWordOnBoard = -1;
const playerGuessesNow = 1;

//grabs a random word that will be the answer as well as the first word that is displayed
const fetchWord = async () => {
  await axios
    .get("http://localhost:8080/getRandomWord")
    .then((response) => {
      if (gameStatus == firstWordOnBoard) {
        firstWord = response.data.words[0].word;
        gameStatus++;
        // console.log("First Word -> ", firstWord);
      } else {
        randomWord = response.data.words[0].word;
        console.log("Current Word to Guess -> ", randomWord);
      }
    })
    .catch((error) => console.error(error));
};
// will set the variable isWord to 1 if is a good guess
const fetchIsWord = async (input) => {
  await axios
    .post("http://localhost:8080/checkAllWords", {
      word: `${input}`,
    })
    .then((res) => {
      isWord =
        res.data.word[0][
          `EXISTS(SELECT * from allowed_words WHERE word = '${input}') or EXISTS(SELECT * from words WHERE word = '${input}')`
        ];
      // console.log(res.data.word[0][`EXISTS(SELECT * from allowed_words WHERE word = '${input}') or EXISTS(SELECT * from words WHERE word = '${input}')`])
    });
};
// sends the guessed word back to the backend along with the correctness
const postWord = async (word, correctness) => {
  await axios
    .post("http://localhost:8080/submitWord", {
      word: `${word}`,
      numbers: `${correctness}`,
    })
    .then((res) => {
      // console.log("Successful Post of the inputted guess");
      // console.log("Guess this now -> " , res.data.guessThis)
      currentBotGuess = res.data.guessThis;
    });
};
// clears the arrays in the backend for the bot
// this should be used when a game ends and a new one starts
const clearBot = async () => {
  await axios
    .get("http://localhost:8080/clear")
    .then(() => console.log("Clearing Done of the server arrays of words"));
};
// used to clear each square of the board when game is over and newGameBtn is clicked
function clearSquare(square) {
  square.classList.remove("empty");
  square.classList.remove("correct");
  square.classList.remove("present");
  square.classList.remove("absent");
}
// adding the newGameBtn to the DOM
async function addNewGameButton(newGameBtn) {
  newGameBtn.innerHTML = "New Game";
  newGameBtn.style.position = "relative";
  newGameBtn.style.left = "700px";
  newGameBtn.style.bottom = "175px";
  newGameBtn.style.width = "363px";
  newGameBtn.style.height = "40px";
  newGameBtn.style.fontSize = "32px";
  newGameBtn.style.color = "#FFFFFF";
  newGameBtn.style.backgroundColor = "#2E2E2E";
  newGameBtn.style.border = "none";
  newGameBtn.style.fontFamily = "Futura, sans-serif";
  currentBotGuess = "Bot Guess";
  document.getElementById("bot").innerHTML = currentBotGuess;
  document.body.appendChild(newGameBtn);

  newGameBtn.addEventListener("click", () => {
    newGameButtonEvent(newGameBtn);
  });
}
// the event code for when the newGameBtn is clicked
async function newGameButtonEvent(newGameBtn) {
  gameOver = false;
  for (let i = 0; i < userTurn * 5; i++) {
    const square = board.children[i];

    square.classList.remove("correct");
    square.classList.remove("present");
    square.classList.remove("absent");

    square.classList.add("empty");

    board.children[i].textContent = "";
  }

  guessedWords = [];
  userTurn = 0;
  tile = 5;
  gameStatus = firstWordOnBoard;
  //would need to fetch a new word as well
  console.clear();
  await clearBot();
  await fetchWord();
  await fetchWord();
  handleSubmit();
  document.getElementById("bot").innerHTML = "Bot Word";

  // clears the board
  for (let i = 0; i < userTurn * 5; i++) {
    clearSquare(board.children[i]);
    board.children[i].classList.add("empty");
    board.children[i].textContent = "";
  }

  newGameBtn.remove();
}
// create the correctness array as well as lies
function createCorrectness(userInput, randomNumber) {
  let wordInfo = "";
  let j = 0;
  for (let i = userTurn * 5; i <= userTurn * 5 + 4; i++) {
    let flag = 0;
    const square = board.children[i];
    const letter = userInput[j];
    if (letter === randomWord[j]) {
      square.classList.remove("empty");
      square.classList.add("correct");

      flag = 1;
    } else if (randomWord.includes(letter)) {
      square.classList.remove("empty");
      square.classList.add("present");
      flag = 2;
    } else {
      square.classList.remove("empty");
      square.classList.add("absent");
      flag = 3;
    }

    if (i == randomNumber && userTurn * 5 < 39) {
      let check = 0;
      while (check == 0) {
        let numForLie = Math.floor(Math.random() * 3);
        let lieType = "";
        //checks lies and remembers what type of lies are on the board
        if (numForLie == 0 && !board.children[i].classList.contains("absent")) {
          lieType = "absent";
          square.classList.remove("empty");
          square.classList.remove("correct");
          square.classList.remove("present");
          square.classList.remove("absent");
          square.classList.add(lieType);
          check = 1;
        }
        if (
          numForLie == 1 &&
          !board.children[i].classList.contains("present")
        ) {
          lieType = "present";
          clearSquare(square);
          square.classList.add(lieType);
          check = 1;
        }
        if (
          numForLie == 2 &&
          !board.children[i].classList.contains("correct")
        ) {
          lieType = "correct";
          clearSquare(square);
          square.classList.add(lieType);
          check = 1;
        }
        if (check == 1) {
          if (lieType == "correct") {
            flag = 1;
          }
          if (lieType == "present") {
            flag = 2;
          }
          if (lieType == "absent") {
            flag = 3;
          }
        }
      }
    }
    //gets type of letter and what level of correctness it is
    if (flag == 1) {
      wordInfo += "2";
    }
    if (flag == 2) {
      wordInfo += "1";
    }
    if (flag == 3) {
      wordInfo += "0";
    }

    board.children[i].textContent = letter;
    j++;
  }
  return wordInfo;
}
// updates the keyboard based on wordInfo
function updateKeyboard(userInput, wordInfo) {
  for (let i = 0; i < 5; i++) {
    // Initialize to -1 in case the letter is not found
    let letterAtIndex = -1;

    // Normalize to lowercase for comparison
    const userInputLetter = userInput[i].toLowerCase();

    // Find the index of the letter in the alphabet
    for (let j = 0; j < 26; j++) {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      if (userInputLetter === alphabet[j]) {
        letterAtIndex = j;
        break; // Exit the loop once the letter is found
      }
    }

    // Update the keyboard based on wordInfo
    if (letterAtIndex != -1) {
      const key = keyboard.children[letterAtIndex];

      if (wordInfo[i] == 0) {
        // grey
        key.classList.remove("empty", "present", "correct");
        key.classList.add("absent");
      } else if (wordInfo[i] == 1) {
        // yellow
        key.classList.remove("empty", "absent", "correct");
        key.classList.add("present");
      } else if (wordInfo[i] == 2) {
        // green
        key.classList.remove("empty", "absent", "present");
        key.classList.add("correct");
      }
    }
  }
}
// creates the board, keyboard, and the submit button for the guesses (with the event listener code)
function gameSetup() {
  // Create the board

  for (let i = 0; i < 45; i++) {
    //create all the squares
    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add("empty");
    board.appendChild(square);
  }

  //creates keyboard

  for (let i = 0; i < 26; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add("empty");
    keyboard.appendChild(square);
  }

  for (let i = 0; i < 26; i++) {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    keyboard.children[i].textContent = alphabet[i];
  }

  // Handle the submit button click
  submitButton.addEventListener("click", handleSubmit);

  //handles keyboard keys being clicked
  document.addEventListener("keydown", (event) => {
    const keyPressed = event.key;
    //handles enter key push
    if (keyPressed == "Enter") {
      handleSubmit();
    }

    if (document.activeElement === input && !gameOver) {
      if (/^[a-zA-Z]$/.test(keyPressed) && currentLength < 5) {
        board.children[tile].textContent = keyPressed;
        currentLength++;
        tile++;
      }
    }
    //handles backspace key push
    if (keyPressed === "Backspace" && !gameOver) {
      if (currentLength != 0) {
        board.children[tile - 1].textContent = "";
        tile--;
        currentLength--;
      }
    }
  });
}

// the main driver code for the game's frontend
// runs when a word is submitted
// sends the valid word to the backend
// updates the board and the keyboard with helper functions
const handleSubmit = async () => {
  // variable name its the user inputted guess
  let userInput;

  // information on latest guess submitted by user.
  // Key: 0 - ABSENT | 1 - PRESENT | 2 - CORRECT
  let wordInfo = "";

  // Variable to send to server. 0th Index includes name of word, 1st Index includes a 5 letter string of numbers. See key above.
  let sendToServer = new Array(2);

  // if its the start of the game the first guess is from the backend
  // if not the start the guesses come from the player
  if (gameStatus == atTheStartOfGame) {
    userInput = firstWord;
    gameStatus = playerGuessesNow;
  } else {
    userInput = input.value.toLowerCase();
  }

  //checking if the word is a valid guess
  await fetchIsWord(userInput);
  if (isWord == false) {
    console.log("Not Valid word");
    return; //if not valid does not let the rest of this go through
  }

  // Check if the user's input is correct
  if (userInput.length != 5) {
    return;
  }

  // can not guess the same word twice
  if (guessedWords.includes(userInput)) {
    return;
  }

  //checks if the user is out of turns and resets board
  if (userTurn == 8) {
    const newGameBtn = document.createElement("button");
    addNewGameButton(newGameBtn);
  }

  if (userInput === randomWord && !gameOver && userTurn < 8) {
    // The user won!
    let j = 0;
    for (let i = userTurn * 5; i <= userTurn * 5 + 4; i++) {
      const square = board.children[i];
      const letter = userInput[j];

      if (letter === randomWord[j]) {
        square.classList.remove("empty");
        square.classList.add("correct");
        wordInfo += "2";
      }

      board.children[i].textContent = letter;
      j++;
      gameOver = true;
    }
    // add button to change
    const newGameBtn = document.createElement("button");
    userTurn += 1;
    addNewGameButton(newGameBtn);
  } else if (!gameOver) {
    // add the word to the list of current guesses
    guessedWords.push(userInput);

    // Update the board to show the user's progress
    let randomNumber = Math.floor(Math.random() * 5);

    if (userTurn != 0) {
      randomNumber = randomNumber + userTurn * 5;
    }

    wordInfo = createCorrectness(userInput, randomNumber, wordInfo);
    userTurn++;
  }

  // this sections runs no matter what after each call to the function

  // clears the input box
  input.value = "";

  currentLength = 0;
  sendToServer[0] = userInput;
  await postWord(sendToServer[0], wordInfo);

  // if the game is over reset the bot guess window
  if (userTurn == 9 || gameOver) {
    currentBotGuess = "Bot Word";
  }

  document.getElementById("bot").innerHTML = currentBotGuess;

  // if the game is over display the correct word
  let banner = "";
  if (userTurn == 9 || gameOver) {
    banner = `Correct word was -> ${randomWord}`;
  }
  document.getElementById("botCorrect").innerHTML = `${banner}`;

  updateKeyboard(userInput, wordInfo);
};


// should run first
(async () => {
  gameSetup()
  await clearBot(); // clears the arrays when refreshed
  await fetchWord(); //sets the firstWord
  await fetchWord(); //ses the randomWord
  handleSubmit();
})();
