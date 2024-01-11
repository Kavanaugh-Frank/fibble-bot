// sum.test.js
import { areAnagrams , hasTwoLettersAtDifferentIndexes , hasRepeats, hasLetterAtIndex} from "./bestWord";


test('racecar is an anagram', () => {
  expect(areAnagrams("racecar", "racecar")).toBe(true);
});

test('guess is not an anagram', () => {
  expect(areAnagrams("guess", "guess")).toBe(true);
});

test("the same two letters but at diff indexes", () =>{
  expect(hasTwoLettersAtDifferentIndexes([
    {index:0, letter:"a"},
    {index:4, letter:"a"},
  ])).toBe(true)
})

test("two different letters at diff indexes to insure that it does not return true", () =>{
  expect(hasTwoLettersAtDifferentIndexes([
    {index:0, letter:"b"},
    {index:4, letter:"a"},
  ])).toBe(false)
})


test('string with repeating characters', () => {
  expect(hasRepeats("hello")).toBe(true);
});

test('string without repeating characters', () => {
  expect(hasRepeats("train")).toBe(false);
});

test('string with special characters and repeats', () => {
  expect(hasRepeats("!@#$%^&*()hello1234567890hello")).toBe(true);
});

test('empty string', () => {
  expect(hasRepeats("")).toBe(false);
});

test('letter at valid index matches', () => {
  expect(hasLetterAtIndex("hello", 1, "e")).toBe(true);
});

test('letter at valid index does not match', () => {
  expect(hasLetterAtIndex("world", 2, "x")).toBe(false);
});

test('index is negative', () => {
  expect(hasLetterAtIndex("testy", -1, "t")).toBe(false);
});

test('index is larger than word length', () => {
  expect(hasLetterAtIndex("train", 10, "e")).toBe(false);
});

// Matts Unit Tests:

// Test #1
test('a string that is empty', () => {
  expect(hasLetterAtIndex("", 0, "a")).toBe(false);
});
// Test #2
test('the correct letter at the correct index', () => {
  expect(hasLetterAtIndex("start", 0, "s")).toBe(true);
});
// Test #3
test('wrong letter at index', () => {
  expect(hasLetterAtIndex("poles", 4, "f")).toBe(false);
});
