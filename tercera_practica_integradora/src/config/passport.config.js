import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils.js";
import config from "./config.js";
import { cartService, userService } from "../services/index.repositories.js";
import { sendPasswordResetEmail, generateResetToken, isResetLinkExpired } from "../utils.js";
import bcrypt from "bcrypt";

const { CLIENTID, CLIENTSECRET, CALLBACKURL, ADMINUSER, ADMINPASS } = config;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (username, password, done) => {
        if (username === ADMINUSER && password === ADMINPASS) {
            const user = {
                _id: "admin",
                first_name: "admin",
                last_name: "admin",
                email: ADMINUSER,
                age: "",
                password: ADMINPASS,
                role: "admin",
                cart: ""
            };
            return done(null, user);
        }

        try {
            const user = await userService.getUserByEmail(username);
            if (!user) {
                console.log("No user with that email address was found");
                return done(null, false);
            }

            if (!validatePassword(password, user)) {
                console.log("Invalid Password");
                return done(null, false);
            }

            done(null, user);
        } catch (error) {
            done("Error: " + error);
        }
    }));

    passport.use("github", new GitHubStrategy({
        clientID: CLIENTID,
        clientSecret: CLIENTSECRET,
        callbackURL: CALLBACKURL,
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) =>{
        console.log(profile);
        try {
            const user = await userService.getUserByEmail(profile._json.email);
            console.log(user);
            if (user) {
                console.log("Logged in");
                return done(null, user);
            }

            const newUser = {
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                password: ""
            };

            const result = await userService.createUser(newUser);

            return done(null, result);
        } catch (error) {
            return done("Couldn't login with github: "+error);
        }
    }));

    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            const user = await userService.getUserByEmail(username);
            if (user) {
                console.log("User is already registered");
                return done(null, false);
            }
            
            const newCart = await cartService.createNewCart();
            console.log(newCart);
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart._id
            };
    
            const result = await userService.createUser(newUser);
            return done(null, result);
        } catch (error) {
            done("Error: " + error);
        }        
    }));

    passport.use("reset-password", new LocalStrategy({
        usernameField: "email"
    }, async (email, _, done) => {
        try {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                console.log("No user with that email address was found");
                return done(null, false);
            }

            const resetToken = generateResetToken();
            const resetExpiration = new Date();
            resetExpiration.setHours(resetExpiration.getHours() + 1); 
            await userService.setResetPasswordToken(user._id, resetToken, resetExpiration);

            const resetLink = `http://localhost:8080/reset-password/${resetToken}`;
            await sendPasswordResetEmail(email, resetLink);

            done(null, true); 
        } catch (error) {
            done("Error: " + error);
        }
    }));

    passport.use("reset-password-confirm", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "token"
    }, async (req, token, _, done) => {
        try {
            const user = await userService.getUserByResetToken(token);
            if (!user) {
                console.log("Invalid or expired reset token");
                return done(null, false);
            }

            if (user.resetPasswordExpiration < new Date()) {
                console.log("Reset token has expired");
                return done(null, false);
            }

            const hashedPassword = createHash(req.body.password);
            await userService.updateUserPassword(user._id, hashedPassword);

            
            await userService.clearResetPasswordToken(user._id);

            done(null, true); 
        } catch (error) {
            done("Error: " + error);
        }
    }));

    passport.use("current", new LocalStrategy({}, async () =>{
        
    }) );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done) =>{
        if (id === "admin") {
            return done(null, false);
        }

        const user = await userService.getUserById(id);
        done(null, user);
    });
};

export default initializePassport;