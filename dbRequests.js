const spicedPg = require("spiced-pg");
const { password } = require("./secrets.json");
const db = spicedPg(`postgres:postgres:${password}@localhost:5432/petition`);

module.exports.insertSig = function insertSig(name, surname, signiture) {
    return db.query(
        "INSERT INTO signedPetition (name,surname, signiture) VALUES($1,$2,$3) RETURNING id",
        [name, surname, signiture]
    );
    console.log("SAVED TO THE DATABASE");
};
// returns a promise, which will be the resolved data base insert
//FOR POST REQUEST

module.exports.queryDb = function queryDb() {
    return db.query("SELECT * FROM signedPetition");
};

// module.exports.getSigniture = function getSigniture() {
//     return db.query("SELECT id,signiture FROM signedPetition");
// };
module.exports.getSigniture = function(sigId) {
    return Promise.all([
        db.query("SELECT signiture FROM signedPetition WHERE id =$1", [sigId]),
        db.query("SELECT count(*) FROM signedPetition")
    ]);
};

// when run and log this promise is still pending
// loop didn't work yesterday

//Function for qery db for email adress
