CREATE DATABASE IF NOT EXISTS  fibble_words;
USE fibble_words;

CREATE TABLE IF NOT EXISTS words (
    id integer PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS allowed_words (
    id integer PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(255) NOT NULL
);

LOAD DATA LOCAL INFILE './word_lists/spaced.txt' 
INTO TABLE words
-- FIELDS TERMINATED BY '\t'  
FIELDS TERMINATED BY '\n';

LOAD DATA LOCAL INFILE './word_lists/spaced_allow.txt' 
INTO TABLE allowed_words
-- FIELDS TERMINATED BY '\t'  
FIELDS TERMINATED BY '\n';