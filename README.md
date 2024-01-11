# Fibble Force Engineers
## Kavanaugh Frank, Nick Beoglos, Alec Martell, Matthew Proboski, and Amos Agyeman Jr.​

This project is for CS 3560's semester long project where we attempted to make a bot to beat the online game Fibble, which is a variation of the popular game of Wordle. To do this we made our own Fibble game using HTML, JS, CSS, NodeJS, and mySQL. After successfully replicating Fibble we began to work on our bot. We have  a hard coded bot the prioritizes finding which tiles are lies. We will discuss the algorithim we use down below. The difference between the two games is that for every guesses word there is a lie. For example a letter could not be in the word to guess, but the game will lie to you and say it is. There is only one guess per attempt. The goal of the game is to guess to word while navigating the lies. 

## Basic Algorithm

1. After each turn made, the bot generates a list of boards each with a different possible combinations of lies.
2. The bot then takes a look at each one of these boards and checks to see whether or not it makes logical sense. For instance, if a tile is marked as green in one guess and a tile of the same letter is marked grey in the other, and they are both marked true in that board, then the bot knows that specific board cannot exist.
3. After this process, there will always be at least one board that makes logical sense and by taking the letters that are marked as true, the bot then provides constraints for the next word it needs to guess.
4. This process is repeated until the 9th guess or until there is only one word that meets the constraints

**note that this is a simplified version of the algorithm that the bot uses to find the right word. in reality, there are more steps involved**

## Installation

```
# Clone the repository
$ git@github.com:OU-CS3560/fibble-cpp-f23.git

# Navigate to the project directory
$ cd fibble-cpp-f23.git

# Navigate to the server folder
$ cd server

# Install dependencies
$ npm install
```

To fully run the project you will need to have a mySQL database setup on your system and you will need to run our schema.sql file to setup the needed databases for the project. We will not cover how to install mySQL as there are many resources online. You will also need your own .env file with your mysql host, username, password, and the database name.

[mySQL Installation Guide]: https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/

```
# .env example

MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'password'
MYSQL_DATABASE = 'fibble_words'
```

Ensure that the word list are correctly located to the file path located in the schema.sql file. If you host them else where change the file path.
```
# Running the schema.sql file
$ mysql -u <username> -p <password>
$ source schema.sql
```
## Starting the project
Firstly open the index.html file in your chosen web browser. Then run the following code in the server directory to start up the server to allow communication between frontend and backend.

The benefit of using nodemon is that whenever a JS file in the server directory is saved the server restarts automaticlly to reflect those changes. The package.json file allows for scripts which is how 'npm run dev' works.

```
# Using nodemon by the package.json script syntax
$ npm run dev

# Using the standatd Nodemon syntax
$ nodemon server.js

# Usingg the standard NodeJS syntax
$ node server.js
```

You will know the server is running when "Live on 8080" is outputted to the terminal.

## Dependencies
The following list can be found in the package.json file in the server directory.
- axios
- body-parser
- cors
- express
- mysql2
- dotenv (dev)
- nodemon (dev)

