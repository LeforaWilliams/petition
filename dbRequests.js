const spicedPg = require("spiced-pg");
const { password } = require("./secrets.json");
const db = spicedPg(`postgres:postgres:${password}@localhost:5432/petition`);

module.exports.insertSig = function insertSig(name, surname, signiture) {
    return db.query(
        "INSERT INTO signedPetition (name,surname, signiture) VALUES($1,$2,$3)",
        [name, surname, signiture]
    );
    console.log("SAVED TO THE DATABASE");
};
// returns a promise, which will be the resolved data base insert
//FOR POST REQUEST
