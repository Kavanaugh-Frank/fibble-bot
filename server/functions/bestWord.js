function calculateLevenshteinDistance(word1, word2) {
  const matrix = Array.from({ length: word1.length + 1 }, (_, i) =>
    Array.from({ length: word2.length + 1 }, (_, j) => i || j)
  );

  for (let i = 1; i <= word1.length; i++) {
    for (let j = 1; j <= word2.length; j++) {
      const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[word1.length][word2.length];
}

export function areAnagrams(word1, word2) {
  const sortedWord1 = word1.split("").sort().join("");
  const sortedWord2 = word2.split("").sort().join("");
  return sortedWord1 === sortedWord2;
}

export function hasRepeats(str) {
  return /(.).*\1/.test(str);
}

export function hasLetterAtIndex(word, index, letter) {
  if (index >= 0 && index < word.length) {
    return word[index] === letter;
  }
  return false;
}

function lettersToIncludeFunction(lettersToInclude, word) {
  return lettersToInclude.every((letter) => word.includes(letter));
}

function lettersToExcludeFunction(lettersToExclude, word) {
  return lettersToExclude.every((letter) => !word.includes(letter));
}

export function hasTwoLettersAtDifferentIndexes(array) {
  const letterIndexes = {};

  for (const { index, letter } of array) {
    if (letterIndexes[letter] === undefined) {
      // If the letter is not in the letterIndexes object, store its index
      letterIndexes[letter] = index;
    } else {
      // If the letter is already in the letterIndexes object, check if it's at a different index
      if (letterIndexes[letter] !== index) {
        return true; // Found two letters at different indexes
      }
    }
  }

  return false; // No two letters at different indexes
}

export async function findMostSimilarWord(
  targetWord,
  wordArray,
  wordsGuessed,
  exclude,
  include,
  include_at_index,
  check_for_repeats
) {
  let minDistance = Infinity;
  let mostSimilarWord = "";
  let lettersToExclude = exclude;
  let lettersToInclude = include;
  let DontCheckForRepeats = true;
  // let lettersToIncludeAtIndex = include_at_index;

  let lettersToIncludeAtIndex = include_at_index.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (entry) => entry.index === value.index && entry.letter === value.letter
      )
  );

  console.log(
    "Letters to Include at Position: ",
    lettersToIncludeAtIndex,
    "\n\n"
  );

  if (hasTwoLettersAtDifferentIndexes(lettersToIncludeAtIndex)) {
    DontCheckForRepeats = false
  }

  if (wordsGuessed.length == 8 || !check_for_repeats) {
    console.log("!!!!!!!!!!!!Repeats Checking")
    // will not exclude the word if there is a repeat
    // only used on the last guess
    for (const word of wordArray) {
      if (
        word != targetWord &&
        !wordsGuessed.includes(word) &&
        lettersToExcludeFunction(lettersToExclude, word) &&
        lettersToIncludeFunction(lettersToInclude, word) &&
        lettersToIncludeAtIndex.every(({ index, letter }) =>
          hasLetterAtIndex(word, index, letter)
        )
      ) {
        const distance = calculateLevenshteinDistance(targetWord, word);
        if (distance < minDistance) {
          minDistance = distance;
          mostSimilarWord = word;
        }
      }
    }
    DontCheckForRepeats = false;
  } else {
    // will exclude repeats
    for (const word of wordArray) {
      if (
        word != targetWord &&
        !wordsGuessed.includes(word) &&
        lettersToExcludeFunction(lettersToExclude, word) &&
        lettersToIncludeFunction(lettersToInclude, word) &&
        lettersToIncludeAtIndex.every(({ index, letter }) =>
          hasLetterAtIndex(word, index, letter)
        ) &&
        !hasRepeats(word) // added this for the first run
      ) {
        // console.log("HERE")
        if (areAnagrams(targetWord, word)) {
          return word;
        } else {
          const distance = calculateLevenshteinDistance(targetWord, word);
          if (distance < minDistance) {
            minDistance = distance;
            mostSimilarWord = word;
          }
        }
      }
    }
  }


  DontCheckForRepeats = true;
  // if with the parameters we get nothing we relax the given parameters
  if (minDistance == Infinity) {
    // console.log("Relaxing the Parameters");
    if (lettersToExclude.length > 0) {
      // can not do both
      // either randomly remove a letter
      const randomIndex = Math.floor(Math.random() * lettersToExclude.length);
      lettersToExclude.splice(randomIndex, 1);

      // or remove the last one
      // lettersToExclude.pop();

      // console.log("letters to exclude", lettersToExclude);
      return findMostSimilarWord(
        targetWord,
        wordArray,
        wordsGuessed,
        lettersToExclude,
        lettersToInclude,
        lettersToIncludeAtIndex,
        DontCheckForRepeats
      );
    } else if (lettersToInclude.length > 0) {
      // can not do both
      // either randomly remove a letter
      const randomIndex = Math.floor(Math.random() * lettersToInclude.length);
      lettersToInclude.splice(randomIndex, 1);

      // or remove the last one
      // lettersToInclude.pop();

      console.log("letters to include now", lettersToInclude , "\n");
      return findMostSimilarWord(
        targetWord,
        wordArray,
        wordsGuessed,
        lettersToExclude,
        lettersToInclude,
        lettersToIncludeAtIndex,
        DontCheckForRepeats
      );
    } else if (lettersToIncludeAtIndex.length > 0) {
      // can not do both
      // either randomly remove a letter
      const randomIndex = Math.floor(
        Math.random() * lettersToIncludeAtIndex.length
      );
      lettersToIncludeAtIndex.splice(randomIndex, 1);

      // or remove the last one
      // lettersToInclude.pop();

      console.log("letters to include now", lettersToIncludeAtIndex, "\n");
      return findMostSimilarWord(
        targetWord,
        wordArray,
        wordsGuessed,
        lettersToExclude,
        lettersToInclude,
        lettersToIncludeAtIndex,
        DontCheckForRepeats
      );
    }
  }
  console.log("\n\n")
  return mostSimilarWord;
}
