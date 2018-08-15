const express = require("express");
const app = express();
const hb = require("express-handlebars");
const { insertSig } = require("./dbRequests.js");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
app.use(express.static("./public"));
//redirecting when going to localhose
app.get("/", function(req, res) {
    res.redirect("/home");
});

app.get("/home", function(req, res) {
    res.render("petitionHome", {
        layout: "main"
    });
});

app.post("/home", function(req, res) {
    console.log(req.body);
    if (!req.body.name || !req.body.surname || !req.body.sig) {
        res.redirect("/home");
    } else {
        insertSig(req.body.name, req.body.surname, req.body.sig)
            .then(function(value) {
                console.log(value);
            })
            .catch(function(err) {
                console.log(err);
            });
        res.redirect("/thanks");
    }
});

app.get("/thanks", function(req, res) {
    res.render("thanks", {
        layout: "main"
    });
});
app.listen(8080, () => console.log("listening :D"));
