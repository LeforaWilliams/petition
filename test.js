const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/cities");

function changeCityName(id, name) {
    db.query("UPDATE city, SET city = $2 WHERE id=$1", [id, name])
        .then(function(results) {
            console.log(results.rows);
        })
        .catch(function(err) {
            console.log(err);
        });
}
