require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const rateLimit = require("express-rate-limit");
var get_ip = require("ipware")().get_ip;

var JWTstrategy = require("passport-jwt").Strategy,
    ExtractJWT = require("passport-jwt").ExtractJwt;

var utils = require("./utils/main.utils");
var cors = require("cors");

const userRoutes = require("./src/routesOld/user.routes");
const authRoutes = require("./src/routesOld/auth.routes");
const projectRoutes = require("./src/routesOld/project.routes");
const taskRoutes = require("./src/routesOld/task.routes");
const tagRoutes = require("./src/routesOld/tag.routes");
const statRoutes = require("./src/routesOld/stat.routes");

//modules needed for auth
const User = require("./src/models/user.model");

// create express app
const app = express();

// Setup server port
const port = process.env.PORT || 5000;

// configure passport.js to use the local strategy
var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
opts.issuer = "5.253.24.115";
opts.audience = "5.253.24.115";

passport.use(
    new JWTstrategy(
        {
            secretOrKey: "TOP_SECRET",
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

var failures = {};

function onLoginFail(ip) {
    var f = (failures[ip] = failures[ip] || { count: 0, nextTry: new Date() });
    ++f.count;
    f.nextTry.setTime(Date.now() + 2000 * f.count); // Wait another two seconds for every failed attempt
}

function onLoginSuccess(ip) {
    delete failures[ip];
}

// Clean up people that have given up
var MINS10 = 600000,
    MINS30 = 3 * MINS10;
setInterval(function () {
    for (var ip in failures) {
        if (Date.now() - failures[ip].nextTry > MINS10) {
            delete failures[ip];
        }
    }
}, MINS30);

passport.use(
    new LocalStrategy(
        { usernameField: "username", passReqToCallback: true },
        (req, username, password, done) => {
            
            console.log(failures);
            let user_ip = get_ip(req).clientIp;
            var f = failures[user_ip];
            if (f && Date.now() < f.nextTry) {
                return done(Error("Too many login try! Wait some minutes :)"), null);
            }

            User.findByUsername(username, function (err, user) {
                if (!err && user[0]) {
                    const hashedPass = utils.saltHash(password, user[0].salt);
                    if (
                        username === user[0].username &&
                        hashedPass.passwordHash === user[0].password
                    ) {
                        let userToSend = user[0];
                        delete userToSend.password;
                        delete userToSend.salt;
                        onLoginSuccess(user_ip);
                        return done(null, user[0]);
                    } else {
                        onLoginFail(user_ip);
                        return done(Error("Username or password is incorrect!"), null);
                    }
                } else {
                    return done(err, null);
                }
            });
        }
    )
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    if (!user) {
        return done(Error("Username or password is incorrect!"), null);
    }
    console.log("\nNew Successfull login:");
    console.log(user);
    console.log("\n");
    done(null, user);
});

passport.deserializeUser((user, done) => {
    if (!user) {
        return done(Error("Username or password is incorrect!"), null);
    }
    console.log("\nBellow User requested something:");
    console.log(user);
    console.log("\n");
    done(null, user);
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(
    session({
        genid: (req) => {
            console.log(req.sessionID);
            return uuid(); // use UUIDs for session IDs
        },
        store: new FileStore(),
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

//limiter (Brute Force)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP",
});
app.use(limiter);

// define a root route
app.get("/", (req, res) => {
    res.send("Hello World");
    console.log(req.sessionID);
});

app.get("/login", (req, res) => {
    res.send("Login First!");
    console.log(req.sessionID);
});

const BASE_API = "/api/v1/";

app.use(BASE_API + "user", userRoutes);
app.use(BASE_API + "auth", authRoutes);
app.use(BASE_API + "project", projectRoutes);
app.use(BASE_API + "task", taskRoutes);
app.use(BASE_API + "tag", tagRoutes);
app.use(BASE_API + "stat", statRoutes);

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});