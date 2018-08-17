/*
Pluggin security holes for deploying the website on the internet
> don't tell the world that you are using EXPRESS
> protect against sql injection by using $ and store your inputs in a array


*/

//prevent website framing

app.use(function(req, res, next) {
    res.setHeader("x-frame-options", "DENY");
    next();
});

//content securtiy policy header
