DROP TABLE IF EXISTS signedPetition;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(168) NOT NULL,
    surname VARCHAR(168) NOT NULL,
    email VARCHAR(168) NOT NULL UNIQUE,
    password VARCHAR(168) NOT NULL

);

CREATE TABLE signedPetition (
    id SERIAL PRIMARY KEY,
    signiture TEXT,
    user_id INTEGER NOT NULL UNIQUE
    REFERENCES users(id)

);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE
     REFERENCES users(id),
    age INTEGER ,
    city VARCHAR(168),
    url VARCHAR(280)
);
