//HEAD- REQUIRING; SET UP
const express = require("express");
const app = express();
const hb = require("express-handlebars");
const { insertSig, queryDb, getSigniture } = require("./dbRequests.js");
const cookieSession = require("cookie-session");

// const csurf = require("csurf");
// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
// });

app.disable("x-powered-by");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
app.use(
    cookieSession({
        // adds a session object to every req.object
        secret: `Ficus elastica`,
        maxAge: 1000 * 60 * 60 * 24 * 16
    })
);

function sigIdCheck(req, res, next) {
    console.log("inside checkForSigId", req.session);

    if (!req.session.submission) {
        res.redirect("/");
    } else {
        next();
    }
}
// app.use(csurf());
// a; //dds csrf token to req object
app.use(express.static("./public"));

//END HEAD_________________________________________________________________________

//redirecting when going to localhost
app.get("/", function(req, res) {
    res.redirect("/home");
});
app.get("/registration", function(req, res) {
    //form for information
    //create new table for users, first,last,email UNIQUE, password restriction
});
app.post("/registration", function(req, res) {
    //enter data to DATABASE
    //user should be logged in upon registration
    //email and name goes into database,
    //password is hashed and salted and save hash and salt togehter in the database
    //save userid in request.session, maybe even first and last name
});

app.get("/login", function(req, res) {
    //email and name goes into database,
    //password is hashed and salted and save hash and salt togehter in the database
});
app.post("/login", function(req, res) {
    //email and name goes into database,
    //password is hashed and salted and save hash and salt togehter in the database
});

app.get("/home", function(req, res) {
    if (!req.session.submission) {
        res.render("petitionHome", {
            layout: "main"
        });
    } else {
        res.redirect("/thanks");
    }
});

app.post("/home", function(req, res) {
    console.log(req.body.name, req.body.surname);
    if (!req.body.name || !req.body.surname || !req.body.sig) {
        res.render("petitionHome", {
            layout: "main",
            error: true
        });
    } else {
        insertSig(req.body.name, req.body.surname, req.body.sig)
            .then(function(value) {
                req.session.submission = value.rows[0].id; //acces the rows here and don't set it to a random value
                res.redirect("/thanks");
            })
            .catch(function(err) {
                console.log("CATCH ERROR", err);
                res.render("petitionHome", {
                    layout: "main",
                    error: true
                });
            });
    }
});

app.get("/thanks", sigIdCheck, function(req, res) {
    // getSigniture(req.session.submission);
    getSigniture(req.session.submission).then(function([id, count]) {
        console.log(id, count);
        res.render("thanks", {
            layout: "main",
            signiture: id.rows[0].signiture,
            singnersCount: count.rows[0].count
        });
    });
});

app.get("/signers", function(req, res) {
    queryDb().then(function(names) {
        res.render("signers", {
            layout: "main",
            signers: names.rows
        });
    });
});
app.listen(8080, () => console.log("listening :D"));
