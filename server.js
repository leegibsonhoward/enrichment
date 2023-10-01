"use strict";

const express = require("express");
const app = express();
const router = require('./routes/index');
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressValidator = require("express-validator");
const connectFlash = require('connect-flash');
const sassMiddleware = require('node-sass-middleware');

const User = require('./models/user');

// use new Server Discover and Monitoring engine
// with { useUnifiedTopology: true } option set
mongoose.connect(
    "mongodb://localhost:27017/enrichment_db01", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);

// sass and scss middleware
// use before express static middleware 
app.use(
    sassMiddleware({
        src: __dirname + '/scss',    // input supports .sass or .scss files
        dest: __dirname + '/public', // output .css to public/css.style.css
        debug: false                  // set debug false on production ?            
    })
);

// use 'public' folder for static assets
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout', 'layouts/layout_form');

app.use(layouts);

// parse urlencoded and json payloads
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// use 3000 for fallback port
app.set("port", process.env.PORT || 3000);

// allow support for PUT, DELETE request methods
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
 }));

// use validation middleware
app.use(expressValidator());
// installed older express-validator@5.3.1
// due to changes in newer versions
//

// configure cookieParser with a secret key
app.use(cookieParser("removebeforeproduction123")); 

// configure Express.js to use sessions
app.use(expressSession({
    secret: "removebeforeproduction123",
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}));
// configure Express.js to initialize and use passport
app.use(passport.initialize());

// instruct passport to use sessions
app.use(passport.session());

// set up the default login strategy
passport.use(User.createStrategy());

// passport compress, encrypt, and decrypt user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use connect-flash as middleware
app.use(connectFlash());

// custom middleware for flash messages
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});

// use router, routes/index.js
app.use("/", router);

// listen on port 3000
app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${
        app.get("port")
    } `);
});
