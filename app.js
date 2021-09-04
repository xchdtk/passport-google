const express = require('express')
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require("fs");
const app = express();
app.use(session({ secret: 'SECRET_CODE', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('', __dirname + '');
app.set('view engine', 'ejs');

passport.use(new GoogleStrategy({
    clientID: "122393044315-e02intfu5fm0b1mdnkuu96nukq49bcs3.apps.googleusercontent.com",
    clientSecret: "K0tx6I35hSH5i-Sy5P_tOdli",
    callbackURL: "https://localhost:8000/login/google/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(301).redirect('/login');
  }
};

app.get("/", (req, res) => {
    if (!req.user) return res.redirect("/login");
    fs.readFile("./webpage/main.html", (error, data) => {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

app.get("/login", (req, res) => {
    if (req.user) return res.redirect("/");
    fs.readFile("./webpage/login.html", (error, data) => {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});
app.get('/login/google',
  passport.authenticate('google', { scope: ['profile'] })
  );
app.get('/login/google/callback',
	passport.authenticate('google', {
  	failureRedirect: '/login',
  	successRedirect: '/'
}));

app.listen(8000)
console.log("server is running")


