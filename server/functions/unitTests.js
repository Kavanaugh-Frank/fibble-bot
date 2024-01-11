// sum.test.js
import { areAnagrams , hasTwoLettersAtDifferentIndexes} from "./bestWord";


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
  expect(hasRepeats("world")).toBe(false);
});

test('string with special characters and repeats', () => {
  expect(hasRepeats("!@#$%^&*()hello1234567890hello")).toBe(true);
});

test('empty string', () => {
  expect(hasRepeats("")).toBe(false);
});




