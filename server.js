require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const rateLimit = require("express-rate-limit");
const get_ip = require("ipware")().get_ip;
const cors = require("cors");
const utils = require("./utils/main.utils");
const { exec } = require("child_process");

//Routes
const userRoutes = require("./src/routes/user.routes");
const logRoutes = require("./src/routes/log.routes");
const fileRoutes = require("./src/routes/file.routes");


var JWTstrategy = require("passport-jwt").Strategy,
    ExtractJWT = require("passport-jwt").ExtractJwt;

//for user auth by passport
const User = require("./src/models/user.model");

//** Server Setup */
const port = process.env.PORT || 5000;
const BASE_API = "/api/v1/";
const UBUNTU_PASS = "marzie78"

//** Configure passport.js to use the local strategy */
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

passport.use(
   new LocalStrategy(
       { usernameField: "username", passReqToCallback: true },
       (req, username, password, done) => {
        if (username) {
            return done(Error("Username is not provided"), null);
         }
         if (password) {
            return done(Error("Password is not provided"), null);
         }
    
        //TODO: Log Req!
        //  Log.add(req.body, function (err, data) {
        //     if (err) {
        //        res.status(405).send({
        //           error: true,
        //           message: {
        //              text: err
        //           },
        //        });
        //     }
        //  });
      
         exec(`echo ${UBUNTU_PASS} | sudo -S awk -F[:$] '$1 == "${username}" {print $5}' /etc/shadow`, (error, stdout, stderr) => {
            if (error) {
               console.log(`error: ${error.message}`);
               return done(Error("Error while loging in - " + error.message), null);
            }
            if (stderr) {
               console.log(stderr);
               return done(Error("Error while loging in - " + stderr), null);
            }
      
            const ubunntuHashedPass = stdout;
      
            exec(`echo ${UBUNTU_PASS} | sudo -S awk -F[:$] '$1 == "${username}" {print $4}' /etc/shadow`, (error, stdout, stderr) => {
               if (error) {
                  console.log(`error: ${error.message}`);
                  return done(Error("Error while loging in - " + error.message), null);
               }
               if (stderr) {
                  console.log(stderr);
                  return done(Error("Error while loging in - " + stderr), null);
               }
      
               const ubuntuSalt = stdout;
      
               const incomingHashedPass = utils.sha512(password, ubuntuSalt);
      
               if (incomingHashedPass == ubunntuHashedPass) {
                  return done(null, {username: username});
               } else {
                  return done(Error("Password is incorrect!"), null);
               }
      
            });
      
         });
       }
   )
);


//serializer
passport.serializeUser((user, done) => {
   if (!user) {
       return done(Error("Username or password is incorrect!"), null);
   }
   console.log("New Successfull login:");
   console.log(user);
   done(null, user);
});

passport.deserializeUser((user, done) => {
   if (!user) {
       return done(Error("Username or password is incorrect!"), null);
   }
   console.log("Bellow User requested something:");
   console.log(user);
   done(null, user);
});


//** Content Type handlers */
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(passport.initialize());
// app.use(passport.session());

//** CORS */
app.use(
   cors({
       origin: "*",
       credentials: true,
       optionsSuccessStatus: 200,
   })
);

//** BruteForce limiter */
const limiter = rateLimit({
   windowMs: 1 * 60 * 1000,
   max: 100,
   message: "Too many requests from this IP",
});
app.use(limiter);

// ** Main Hello World
app.get("/", (req, res) => {
   res.send("Hello World");
   console.log(req.sessionID);
});

//** Main Urls */
app.use(BASE_API + "user", userRoutes);
app.use(BASE_API + "file", fileRoutes);
app.use(BASE_API + "log", logRoutes);

//** listen for requests */
app.listen(port, () => {
   console.log(`Server is listening on port ${port}`);
});