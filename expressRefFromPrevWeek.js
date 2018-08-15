const express = require("express");
const app = express();
const ca = require("chalk-animation");
const basicAuth = require("basic-auth");
const hb = require("express-handlebars");
const fs = require("fs");
app.use(require("cookie-parser")());
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
var auth = function(req, res, next) {
    var creds = basicAuth(req);
    if (!creds || creds.name != "lefxwill" || creds.pass != "tresor2") {
        res.setHeader(
            "WWW-Authenticate",
            'Basic realm="Enter your credentials to see this stuff."'
        );
        res.sendStatus(401);
    } else {
        next();
    }
};
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//*******Mideleware
app.use((req, res, next) => {
    if (!req.cookies.cookieAC && req.url !== "/cookie") {
        res.cookie("url", req.url);
        res.redirect("/cookie");
    } else {
        next();
    }
});

//Creating a get request that will post a checkbox
app.get("/cookie", (req, res) => {
    res.send(
        `
            <h1>Please Accept Cookies to proceed</h1>
            <form method = "POST" action = '/cookie'>
                <input name = 'checkbox'  type='checkbox'> I accept the cookies
                <button type = 'submit'>submit!</button>
            </form>
        `
    );
});

app.post("/cookie", (req, res) => {
    console.log("COOKIE RESPONSE:  ", req.body);
    let cookieStatus = req.body.checkbox;
    if (cookieStatus) {
        res.cookie("cookieAC", 16);
        res.redirect(req.cookies.url);
    } else {
        res.redirect("/cookie");
    }
});

//****Basic Authentication
app.use("/carousel", auth);
app.use(express.static("./projects"));
app.use(express.static("./style"));

//**** TEMPLATES WITH EXPRESS HANDLEBARS
let folders = fs.readdirSync(__dirname + "/projects"); //turn this into an array of objects and add the json file information into it
let foldersObj = folders.map(function(folder) {
    const { name, description } = require(__dirname +
        "/projects/" +
        folder +
        "/info.json");
    return {
        folder,
        name,
        description
    };
});

app.get("/projects", function(req, res) {
    const image = "/projects/" + req.params.projectName + "/screenshot.png";
    res.render("welcomeOverview", {
        layout: "main",
        foldersObj,
        image
    });
});
app.get("/projects/:projectName/description", function(req, res) {
    //loop that compares the name variable to the array of objects to see if the file exists
    const name = req.params.projectName;
    const image = "/" + req.params.projectName + "/screenshot.png";
    const fullProj = "/" + name;
    if (folders.includes(name)) {
        const jsonInfo = require(__dirname +
            "/projects/" +
            name +
            "/info.json");

        res.render("description", {
            layout: "main",
            json: jsonInfo,
            image,
            fullProj,
            foldersObj
        });
    } else {
        res.redirect("/projects");
    }
    app.get("/", function(req, res) {
        res.redirect("/projects");
    });
});
app.listen(8080, () => ca.rainbow("Listening :DD"));
