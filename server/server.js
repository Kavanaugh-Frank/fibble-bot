import express from "express";
import path from "path";

import { clearArrays, guessedWord } from "./functions/fibble.js";
import { checkAllowedWords, getAll, getOneRandomWord } from "./database.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

import cors from "cors";

// constants
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// sends the HTML files immediately
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// loads on the localhost port 8080
app.listen(8080, () => {
  console.log("Live on 8080");
});

app.post("/checkAllWords", async (req, res) => {
  const word = await checkAllowedWords(req.body.word);
  res.json({ word });
});

app.get("/getRandomWord", async (req, res) => {
  const words = await getOneRandomWord();
  res.json({ words });
});

app.post("/submitWord", async (req, res) => {
  const guessThis = await guessedWord(req.body.word, req.body.numbers);
  res.json({ guessThis });
});

app.get("/clear", async (req, res) => {
  await clearArrays();
  res.send("Clearing Done");
});
