import { getAll, getOneRandomWord, reallyGetAll } from "../database.js";
import { findMostSimilarWord } from "./bestWord.js";
let allWordsInDatabase;
(async () => {
  //dont ducking delete
  allWordsInDatabase = await reallyGetAll();
})();
// array that holds all the words guessed within the game
let wordsGuessed = [];
// array that holds the correctness of each guess,
// 0 -> not in the word
// 1 -> correct letter in the wrong position
// 2 -> correct letter in the correct position
let correctnessOfLetters = [];
// an array that holds all the valid boards
let valid_boards = [];
let user_turn = 1;
// an object named tile that has three data members:
// letter, correctness, truthfullness
function tile(letter = "#", correctness = "-1", truthfullness = "T") {
  this.letter = letter;
  this.correctness = correctness;
  this.truthfullness = truthfullness;
}
// creates game board based on the wordsGuessed array nd correctnessOfLetters array
// implemented as a two dimensional array of tiles
function create_game_board() {
  let game_board = [];

  for (let i = 0; i < wordsGuessed.length; i++) {
    let row = [];
    for (let j = 0; j < 5; j++) {
      let new_tile = new tile(wordsGuessed[i][j], correctnessOfLetters[i][j]);
      row.push(new_tile);
    }
    game_board.push(row);
  }

  return game_board;
}
function row_has_one_false(row) {
  let false_count = 0;
  for (let i = 0; i < 5; i++) {
    if (row[i].truthfullness == "F") {
      false_count++;
    }
    if (false_count > 1) {
      return false;
    }
  }
  return true;
}
function copy_game_board(board) {
  // create a new board array
  let new_board = [];
  // runs through each row of the board
  for (let i = 0; i < board.length; i++) {
    // create a new row array
    let new_row = [];
    // runs through each tile within a given row
    for (let j = 0; j < 5; j++) {
      // copy the tile of the given baord at a given location
      let new_tile = new tile(
        board[i][j].letter,
        board[i][j].correctness,
        board[i][j].truthfullness
      );
      // push the tile into the row array
      new_row.push(new_tile);
    }
    // push the row in to the new board
    new_board.push(new_row);
  }

  return new_board;
}
function combine_valid_boards() {
  let combined_game_board = create_game_board();
  // runs through all the valid boards
  for (let i = 0; i < valid_boards.length; i++) {
    let current_valid_board = i;
    // runs through each row in each valid board
    for (let j = 0; j < valid_boards[current_valid_board].length; j++) {
      let current_row = j;
      // runs through each tile in each row in each valid board
      for (let k = 0; k < 5; k++) {
        let current_tile = k;
        if (
          valid_boards[current_valid_board][current_row][current_tile]
            .truthfullness == "F"
        ) {
          combined_game_board[current_row][current_tile].truthfullness = "F";
        }
      }
    }
  }
  return combined_game_board;
}
function removeDuplicates(arr) {
  return [...new Set(arr)];
}
async function find_best_word(board) {
  // create an array that contains all the letters to include in the new word
  let letters_to_include = [];
  // create an array that contains all the letters to exclude in the new word
  let letters_to_exclude = [];
  // create an array of objects that contain what letter to include and at what position
  let letters_to_include_at_position = [];
  // only listen to the true tiles on the final guess
  if(user_turn == 9) {
    console.log("it is the 9th turn");
    for (let i = 0; i < board.length; i++) {
      let current_row = i;
      for (let j = 0; j < 5; j++) {
        let current_tile = j;
        if (board[current_row][current_tile].truthfullness == "T") {
          if (board[current_row][current_tile].correctness == "0") {
            letters_to_exclude.push(board[current_row][current_tile].letter);
          } else if (board[current_row][current_tile].correctness == "1") {
            letters_to_include.push(board[current_row][current_tile].letter);
          } else {
            let obj = {
              index: j,
              letter: board[current_row][current_tile].letter,
            };
            letters_to_include_at_position.push(obj);
          }
        }
      }
    }
  } else {
for (let i = 0; i < board.length; i++) {
    let current_row = i;
    for (let j = 0; j < 5; j++) {
      let current_tile = j;
      if (board[current_row][current_tile].truthfullness == "T") {
        if (board[current_row][current_tile].correctness == "0") {
          letters_to_exclude.push(board[current_row][current_tile].letter);
        } else if (board[current_row][current_tile].correctness == "1") {
          letters_to_include.push(board[current_row][current_tile].letter);
        } else {
          let obj = {
            index: j,
            letter: board[current_row][current_tile].letter,
          };
          letters_to_include_at_position.push(obj);
        }
      } else {
        if (!row_has_one_false(board[current_row])) {
          letters_to_include.push(board[current_row][current_tile].letter);
        }
      }
    }
  }
  }

  

  let uniqueArray = [...new Set(letters_to_include)];
  letters_to_include = uniqueArray;
  uniqueArray = [...new Set(letters_to_exclude)];
  letters_to_exclude = uniqueArray;

  // the letters to include list should over ride the letters to exclude
  // this means that if the same letter is in both, remove the letter in the exclude list
  // this includes the letters to inluce at postion list as well
  function intersection(array1, array2) {
    return array1.filter((value) => !array2.includes(value));
  }
  let a = [];
  for (let i = 0; i < letters_to_include_at_position.length; i++) {
    a.push(letters_to_include_at_position[i].letter);
  }
  letters_to_exclude = intersection(letters_to_exclude, letters_to_include);
  letters_to_exclude = intersection(letters_to_exclude, a);

  console.log("Letters to Exclude: ", letters_to_exclude);
  console.log("Letters to Include: ", letters_to_include);
  // console.log(
  //   "Letters to Include at Position: ",
  //   letters_to_include_at_position
  // );

  // let q = findMostSimilarWord("", allWordsInDatabase, wordsGuessed, letters_to_exclude, letters_to_include, letters_to_include_at_position);

  return findMostSimilarWord(
    "",
    allWordsInDatabase,
    wordsGuessed,
    letters_to_exclude,
    letters_to_include,
    letters_to_include_at_position,
    true
  );
}
function find_valid_boards() {
  if (valid_boards.length == 0) {
    for (let i = 0; i < 5; i++) {
      let possible_board = create_game_board();
      possible_board[0][i].truthfullness = "F";
      if (is_valid_baord(possible_board)) {
        valid_boards.push(possible_board);
      }
    }
  } else {
    // make a new row based on the last guess of the user
    let row = [
      new tile(
        wordsGuessed[wordsGuessed.length - 1][0],
        correctnessOfLetters[wordsGuessed.length - 1][0]
      ),
      new tile(
        wordsGuessed[wordsGuessed.length - 1][1],
        correctnessOfLetters[wordsGuessed.length - 1][1]
      ),
      new tile(
        wordsGuessed[wordsGuessed.length - 1][2],
        correctnessOfLetters[wordsGuessed.length - 1][2]
      ),
      new tile(
        wordsGuessed[wordsGuessed.length - 1][3],
        correctnessOfLetters[wordsGuessed.length - 1][3]
      ),
      new tile(
        wordsGuessed[wordsGuessed.length - 1][4],
        correctnessOfLetters[wordsGuessed.length - 1][4]
      ),
    ];

    // loop that runs through the valid boards
    let valid_board_size = valid_boards.length;
    for (let i = 0; i < valid_board_size; i++) {
      // loop that runs through each tile within the row
      for (let j = 0; j < row.length; j++) {
        let new_row = [];

        for (let k = 0; k < row.length; k++) {
          new_row.push(new tile(row[k].letter, row[k].correctness));
        }

        new_row[j].truthfullness = "F";

        let possible_board = copy_game_board(valid_boards[i]);
        possible_board.push(new_row);

        if (is_valid_baord(possible_board)) {
          valid_boards.push(possible_board);
        }
      }
    }

    for (let i = 0; i < valid_board_size; i++) {
      valid_boards.splice(0, 1);
    }
  }
}
// prints out a specific board
function print_board(board) {
  for (let i = 0; i < board.length; i++) {
    console.log(
      board[i][0].letter,
      board[i][1].letter,
      board[i][2].letter,
      board[i][3].letter,
      board[i][4].letter,
      "   ",
      board[i][0].correctness,
      board[i][1].correctness,
      board[i][2].correctness,
      board[i][3].correctness,
      board[i][4].correctness,
      "   ",
      board[i][0].truthfullness,
      board[i][1].truthfullness,
      board[i][2].truthfullness,
      board[i][3].truthfullness,
      board[i][4].truthfullness
    );
  }
  console.log(" ");
}
// runs through the array of valid boards and prints out each one
function print_valid_boards() {
  console.log("There are ", valid_boards.length, " valid boards:");
  console.log(" ");
  console.log("Key:");
  console.log("0 => letter is not in the word");
  console.log("1 => letter is in the word, but not in the right position");
  console.log("2 => letter is in the word and in the right position");
  console.log(" ");
  console.log("T => the correctness of the letter can be true");
  console.log("F => the correctness of the letter can be false");
  console.log(" ");
  console.log("Letters:    ", "Correctness: ", "Truthfulness:  ");
  console.log(" ");
  for (let i = 0; i < valid_boards.length; i++) {
    print_board(valid_boards[i]);
  }
}
// takes a board as an arguement and check for contradictions
// if there are contradictions, it return false, else, return true
function is_valid_baord(board) {
  // runs through all the tiles of the most recent row that was guessed
  for (let i = 0; i < 5; i++) {
    let most_recent_row = board.length - 1;
    let most_recent_tile = i;
    // runs through each row, excluding the most recent row 
    for (let j = 0; j < board.length - 1; j++) {
      let current_row = j;
      // for each row other than the most recent row, each tile is run through
      for (let k = 0; k < 5; k++) {
        let current_tile_position = k;
        // tile in the most recent row
        let tile_to_check = board[most_recent_row][most_recent_tile];
        // the tile that the most recent row tile is being compared to
        let current_tile = board[current_row][current_tile_position];
        // if the letters of the tiles match up
        if (current_tile.letter == tile_to_check.letter) {
          // if the letters are on the same row
          if (i == k) {
            // 1a
            if (
              current_tile.correctness == "2" &&
              tile_to_check.correctness == "2"
            ) {
              if (
                (current_tile.truthfullness == "T" &&
                  tile_to_check.truthfullness == "F") ||
                (current_tile.truthfullness == "F" &&
                  tile_to_check.truthfullness == "T")
              ) {
                return false;
              }
            }
            // 1b
            if (
              current_tile.correctness == "1" &&
              tile_to_check.correctness == "1"
            ) {
              if (
                (current_tile.truthfullness == "T" &&
                  tile_to_check.truthfullness == "F") ||
                (current_tile.truthfullness == "F" &&
                  tile_to_check.truthfullness == "T")
              ) {
                return false;
              }
            }
            // 1c
            if (
              current_tile.correctness == "0" &&
              tile_to_check.correctness == "0"
            ) {
              if (
                (current_tile.truthfullness == "T" &&
                  tile_to_check.truthfullness == "F") ||
                (current_tile.truthfullness == "F" &&
                  tile_to_check.truthfullness == "T")
              ) {
                return false;
              }
            }
            // 3a
            if (
              (current_tile.correctness == "2" &&
                tile_to_check.correctness == "1") ||
              (current_tile.correctness == "1" &&
                tile_to_check.correctness == "2")
            ) {
              if (
                current_tile.truthfullness == "T" &&
                tile_to_check.truthfullness == "T"
              ) {
                return false;
              }
            }
            //3b
            if (
              (current_tile.correctness == "2" &&
                tile_to_check.correctness == "0") ||
              (current_tile.correctness == "0" &&
                tile_to_check.correctness == "2")
            ) {
              if (
                current_tile.truthfullness == "T" &&
                tile_to_check.truthfullness == "T"
              ) {
                return false;
              }
            }
            //3c
            if (
              (current_tile.correctness == "1" &&
                tile_to_check.correctness == "0") ||
              (current_tile.correctness == "0" &&
                tile_to_check.correctness == "1")
            ) {
              if (
                current_tile.truthfullness == "T" &&
                tile_to_check.truthfullness == "T"
              ) {
                return false;
              }
            }
            // if the letters are on different rows
          } else {
            // 2b
            // if (
            //   current_tile.correctness == "1" &&
            //   tile_to_check.correctness == "1"
            // ) {
            //   if (
            //     (current_tile.truthfullness == "T" &&
            //       tile_to_check.truthfullness == "F") ||
            //     (current_tile.truthfullness == "F" &&
            //       tile_to_check.truthfullness == "T")
            //   ) {
            //     return false;
            //   }
            // }
            // 2c
            if (
              current_tile.correctness == "0" &&
              tile_to_check.correctness == "0"
            ) {
              if (
                (current_tile.truthfullness == "T" &&
                  tile_to_check.truthfullness == "F") ||
                (current_tile.truthfullness == "F" &&
                  tile_to_check.truthfullness == "T")
              ) {
                return false;
              }
            }
            // 4b
            if (
              (current_tile.correctness == "2" &&
                tile_to_check.correctness == "0") ||
              (current_tile.correctness == "0" &&
                tile_to_check.correctness == "2")
            ) {
              if (
                current_tile.truthfullness == "T" &&
                tile_to_check.truthfullness == "T"
              ) {
                return false;
              }
            }
            // 4c
            if (
              (current_tile.correctness == "1" &&
                tile_to_check.correctness == "0") ||
              (current_tile.correctness == "0" &&
                tile_to_check.correctness == "1")
            ) {
              if (
                current_tile.truthfullness == "T" &&
                tile_to_check.truthfullness == "T"
              ) {
                return false;
              }
            }
          }
        // if the letters of the tile dont match up
        } else {
          // more invalid board checks can be put here
          // if the letters are on the same row
          if(i == k) {
            if (
              (current_tile.correctness == "2" &&
                tile_to_check.correctness == "2")) {
              if (
                current_tile.truthfullness == "T" &&
                tile_to_check.truthfullness == "T"
              ) {
                console.log("FALSE BOARD");
                return false;
              }
            }
          // if the letters are on different rows
          } else {

          }
        }
      }
    }
  }

  return true;
}
// sort of the main funciton where all logic resides
// will eventually return the word that the bot will guess
export async function guessedWord(word, numbers) {
  console.log(" ");
  console.log(" ");
  // update the arrays after each guess
  user_turn++;
  wordsGuessed.push(word);
  correctnessOfLetters.push(numbers);
  // find all valid boards
  // finding all possible boards

  find_valid_boards();
  print_board(combine_valid_boards());
  return find_best_word(combine_valid_boards());
}
// clears all the data when the game is restarted
export function clearArrays() {
  wordsGuessed = [];
  correctnessOfLetters = [];
  valid_boards = [];
  user_turn = 1;
}
