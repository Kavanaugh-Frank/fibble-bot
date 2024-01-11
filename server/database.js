import mysql from "mysql2";

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

export async function getAll() {
  const [rows] = await pool.query("SELECT * FROM words");
  return rows;
}

export async function getOneRandomWord() {
  // number will have to change with the number of words available
  const id = Math.floor(Math.random() * 2315) + 1;
  const [row] = await pool.query(`SELECT * FROM words WHERE id = ${id}`);
  return row;
}

export async function checkAllowedWords(word) {
  const [row] = await pool.query(
    `SELECT EXISTS(SELECT * from allowed_words WHERE word = '${word}') or EXISTS(SELECT * from words WHERE word = '${word}') LIMIT 1;`
  );
  return row
}

export async function reallyGetAll(){
  const [results] = await pool.query(
    `SELECT word FROM words UNION SELECT word FROM allowed_words;`
  )
  const wordsArray = results.map(result => result.word);
  return wordsArray
}

export async function getAllWordsWithLetterAndOccurrence(letter, occurrence){
  const row = await pool.query(
     // `SELECT * from words WHERE word REGEXP '[${letter}${letter.toUpperCase()}].*[aA]'`
     `SELECT * FROM words WHERE word REGEXP '([${letter}${letter.toUpperCase()}].*){${occurrence}}'`
  )
  return row;
 }
