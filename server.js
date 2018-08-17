const express = require("express");
const app = express();
const hb = require("express-handlebars");
const { insertSig, queryDb } = require("./dbRequests.js");
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
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: `Lavendula angustifolia.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.get('/', (req,res)=>{
    res.render('home')
})

app.post('/', (req.res){
if(req.body.check)    {
    req.session.checked = true; //set property on the object
res.redirect('/thanks')
}

})

app.listen(8080, () => {
    console.log("listen");
});
/**************************************************************************************************************************
******************************************MATTS CODE YO **********************************************************************************/
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const hb = require('express-handlebars')

app.use(express.static('public'))
app.engine('handlebars', hb())
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({
    secret: `Döner Kebab`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}))

// PURPOSE: to check if user signed petition
// if they have, proceed with whatever they were doing
// if not, redirect them elsewhere
// app.use(function(req, res, next) {
//     if (!req.session.check) {
//         res.redirect('/')
//     } else {
//         next()
//     }
// })

function checkForSigId(req, res, next) {
    console.log("inside checkForSigId", req.session)

    if (!req.session.checked) {
        res.redirect('/')
    } else {
        next()
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/thanks', checkForSigId, (req, res) => {
    console.log("IN THANKS", req.session)

    res.render('thanks')
})

app.post('/', (req, res) => {
    if (req.body.check) {
        req.session.checked = true
    }
    res.redirect('/thanks')
})

app.listen(8080, () => {
    console.log("Listening on port 8080")
})
