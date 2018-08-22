const spicedPg = require("spiced-pg");
const { password } = require("./secrets.json");
const db = spicedPg(`postgres:postgres:${password}@localhost:5432/petition`);

module.exports.insertSig = function insertSig(signiture, userId) {
    return db.query(
        "INSERT INTO signedPetition (signiture,user_id) VALUES($1,$2) RETURNING id",
        [signiture, userId]
    );
};

module.exports.queryDb = function queryDb() {
    return db.query(
        `SELECT users.name, users.surname, user_profiles.url, user_profiles.age,user_profiles.city
        FROM users
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id`
    );
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

module.exports.registerUser = function registerUser(
    name,
    surname,
    email,
    password
) {
    return db.query(
        "INSERT INTO users (name,surname,email,password) VALUES($1,$2,$3,$4) RETURNING id",
        [name, surname, email, password]
    );
    //
};

module.exports.loginUser = function loginUser(email) {
    return db.query("SELECT * FROM users WHERE email= $1", [email]);
};

module.exports.insertUserProfile = function insertUserProfile(
    age,
    city,
    url,
    user_id
) {
    return db.query(
        "INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id",
        [age, city, url, user_id]
    );
};

module.exports.cityQuery = function cityQuery(city) {
    return db.query(
        "SELECT users.name, users.surname, user_profiles.url, user_profiles.age,user_profiles.city FROM users LEFT JOIN user_profiles ON users.id = user_profiles.user_id WHERE city=$1",
        [city]
    );
};

module.exports.updateUsersTable = function(name, surname, email, password, id) {
    return db.query(
        `UPDATE users
         SET name = $1,
         surname = $2,
         email =$3,
         password = $4
         WHERE id = $5`,
        [
            name || null,
            surname || null,
            email || null,
            password || null,
            id || null
        ]
    );
};

module.exports.updateUsersTableNoPs = function(name, surname, email, id) {
    console.log("1");
    return db.query(
        `UPDATE users
         SET name = $1,
         surname = $2,
         email =$3
         WHERE id = $4`,
        [name || null, surname || null, email || null, id || null]
    );
};

module.exports.updateInsertUserProfiles = function(age, city, url, user_id) {
    console.log("2");
    return db.query(
        `INSERT INTO user_profiles (age, city, url,user_id)
    VALUES ($1, $2, $3,$4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, url = $3

        `,
        [age, city, url, user_id]
    );
};

module.exports.getUserProfileInfo = function(user_id) {
    return db.query(
        `SELECT user_profiles.age, user_profiles.city, user_profiles.url, users.name, users.surname,users.email FROM user_profiles
        LEFT JOIN users ON users.id = user_profiles.user_id
        WHERE users.id = $1`,
        [user_id]
    );
};

//UNSIGN FROM THE PETITION
//post request that runs a delete queryDb
//need to also delete the sig ID from the session OBJECT

//don'T need first and last name from sig table anymore becuase it now is stored in the users table
