DROP TABLE IF EXISTS signedPetition;

CREATE TABLE signedPetition (
    id SERIAL PRIMARY KEY,
    name VARCHAR(168) NOT NULL,
    surname VARCHAR(168) NOT NULL,
    signiture TEXT

);

INSERT INTO signedPetition (name,surname) VALUES ('Lefora', 'Williams');
