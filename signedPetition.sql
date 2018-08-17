DROP TABLE IF EXISTS signedPetition;

CREATE TABLE signedPetition (
    id SERIAL PRIMARY KEY,
    name VARCHAR(168) NOT NULL,
    surname VARCHAR(168) NOT NULL,
    signiture TEXT
    user_id INTEGER NOT NULL

);

CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(168) NOT NULL,
    surname VARCHAR(168) NOT NULL,
    email VARCHAR(168) NOT NULL UNIQUE,
    password VARCHAR(168) NOT NULL,

);
