//HEAD- REQUIRING; SET UP
const express = require("express");
const app = express();
const hb = require("express-handlebars");
const {
    insertSig,
    queryDbForSigners,
    getSigniture,
    registerUser,
    loginUser,
    insertUserProfile,
    cityQuery,
    updateUsersTable,
    updateUsersTableNoPs,
    updateInsertUserProfiles,
    getUserProfileInfo,
    deleteSig
} = require("./dbRequests.js");

const cookieSession = require("cookie-session");
const { hashPass, checkPass } = require("./encryption.js");
const csurf = require("csurf");

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
app.use(csurf());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static("public"));

/**********Signiture ID Middleware***********/
function sigIdCheck(req, res, next) {
    if (!req.session.submission) {
        res.redirect("/");
    } else {
        next();
    }
}

function loginIdCheck(req, res, next) {
    if (!req.session.loggedIn) {
        res.redirect("/registration");
    } else {
        next();
    }
}

//redirecting when going to localhost
app.get("/", function(req, res) {
    res.redirect("/home");
});

/**********Registration***********/
app.get("/registration", function(req, res) {
    res.render("registration", {
        layout: "main",
        className: "registration-body"
    });
});
app.post("/registration", function(req, res) {
    if (
        !req.body.name ||
        !req.body.surname ||
        !req.body.email ||
        !req.body.password
    ) {
        res.render("registration", {
            layout: "main",
            error: true
        });
    } else {
        hashPass(req.body.password)
            .then(function(hashedPass) {
                return registerUser(
                    req.body.name,
                    req.body.surname,
                    req.body.email,
                    hashedPass
                );
            })
            .then(function(userId) {
                req.session.userID = userId.rows[0].id;
                req.session.firstName = req.body.name;
                req.session.lastName = req.body.surname;
                req.session.email = req.body.email;
                req.session.loggedIn = userId.rows[0].id;

                res.redirect("/profile");
            })
            .catch(function(err) {
                console.log("ERROR FROM REGI POST ", err);
                res.render("registration", {
                    layout: "main",
                    error: true
                });
            });
    }
});
/**********Registration End***********/

/**********Logout***********/
app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/registration");
});
/**********Logout End***********/

/**********LOGIN***********/
app.get("/login", function(req, res) {
    res.render("login", {
        layout: "main"
    });
});

app.post("/login", function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.render("login", {
            layout: "main",
            error: true
        });
    } else {
        return loginUser(req.body.email).then(function(userInfo) {
            return checkPass(req.body.password, userInfo.rows[0].password)
                .then(function(checkPassRes) {
                    if (checkPassRes) {
                        req.session.userID = userInfo.rows[0].id;
                        req.session.loggedIn = userInfo.rows[0].id;
                        if (req.session.submission) {
                            res.redirect("/thanks");
                        } else {
                            res.redirect("/home");
                        }
                    } else {
                        throw new Error();
                    }
                })
                .catch(function(err) {
                    console.log("This is an LOGIN ERROR IN CATCH  ", err);
                    res.render("login", {
                        layout: "main",
                        error: true
                    });
                });
        });
    }
});
/**********Login END***********/

/**********User Profile Page***********/
app.get("/profile", loginIdCheck, function(req, res) {
    res.render("profilePage", {
        layout: "main"
    });
});

app.post("/profile", loginIdCheck, function(req, res) {
    insertUserProfile(
        req.body.age,
        req.body.city,
        req.body.url,
        req.session.userID
    )
        .then(res.redirect("/home"))
        .catch(function(err) {
            console.log("ERROR IN PROFILE POST REQUEST", err);
        });
});
/**********User Profile Page End***********/

//*************EDIT PROFILE*****************
app.get("/profile/edit", loginIdCheck, function(req, res) {
    console.log("USER ID PROFILE EDIT", req.session.userID);
    getUserProfileInfo(req.session.userID)
        .then(function(userInfo) {
            console.log("USERINFO FROM PROFILE EDIT", userInfo);
            res.render("profileEdit", {
                layout: "main",
                data: userInfo.rows[0]
            });
        })
        .catch(function(err) {
            console.log("ERROR FROM THE PROFILE EDIT GET ROUTE", err);
        });
});

app.post("/profile/edit", loginIdCheck, function(req, res) {
    if (req.body.password == "") {
        console.log("A");
        updateUsersTableNoPs(
            req.body.name,
            req.body.surname,
            req.body.email,
            req.session.userID
        );
    } else {
        hashPass(req.body.password).then(function(hashedPass) {
            console.log("B");
            return updateUsersTable(
                req.body.name,
                req.body.surname,
                req.body.email,
                hashedPass,
                req.session.userID
            );
        });
    }
    console.log("C");
    updateInsertUserProfiles(
        req.body.age,
        req.body.city,
        req.body.url,
        req.session.userID
    )
        .then(res.redirect("/home"))
        .catch(function(err) {
            console.log(
                "THIS ERROR COMES FROM THE PROFILE EDIT POST ROUTE",
                err
            );
        });
});

//************EDIT PROFILE END**************

/**********Petition Hompage***********/
app.get("/home", loginIdCheck, function(req, res) {
    let fN = req.session.firstName;
    let lN = req.session.lastName;
    if (!req.session.submission) {
        res.render("petitionHome", {
            layout: "main",
            fN,
            lN
        });
    } else {
        res.redirect("/thanks");
    }
});

app.post("/home", function(req, res) {
    let fN = req.session.firstName;
    let lN = req.session.lastName;
    if (!req.body.sig) {
        res.render("petitionHome", {
            layout: "main",
            error: true,
            fN,
            lN
        });
    } else {
        insertSig(req.body.sig, req.session.userID)
            .then(function(value) {
                req.session.submission = value.rows[0].id;
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
/**********Petition Hompage End***********/

/**********Thank you page***********/
app.get("/thanks", loginIdCheck, sigIdCheck, function(req, res) {
    // getSigniture(req.session.submission);
    getSigniture(req.session.submission)
        .then(function([id, count]) {
            res.render("thanks", {
                layout: "main",
                signiture: id.rows[0].signiture,
                singnersCount: count.rows[0].count
            });
        })
        .catch(function(err) {
            console.log("ERROR IN THANKS CATCH", err);
            res.render("thanks", {
                layout: "main"
            });
        });
});

app.post("/delete-signature", function(req, res) {
    deleteSig(req.session.userID).then(function() {
        delete req.session.submission;
        res.redirect("/delete-signature");
    });
});

app.get("/delete-signature", function(req, res) {
    res.render("deleteSig", {
        layout: "main"
    });
});
/**********Thank you page end***********/

/**********Signers Page***********/
app.get("/signers", function(req, res) {
    queryDbForSigners()
        .then(function(names) {
            console.log("SIGNERS QUERY NAMES >>>>>>", names.rows);
            res.render("signers", {
                layout: "main",
                signers: names.rows,
                city: true
            });
        })
        .catch(function(err) {
            console.log("ERROR IN SIGNERS GET ROUTE ", err);
        });
});

app.get("/signers/:city", function(req, res) {
    let city = req.params.city;
    // console.log("THE CITY PARAMS", req.params);
    cityQuery(city)
        .then(function(names) {
            console.log("CITY NAMES", names);
            res.render("signers", {
                layout: "main",
                signers: names.rows
            });
        })
        .catch(function(err) {
            console.log("ERROR IN SIGNERS/:CITY ROUTE", err);
        });
});
/**********Signers Page End***********/

app.listen(process.env.PORT || 8080, () => console.log("listening :D"));
