import passport from 'passport';
import passportJWT from 'passport-jwt';
import GitHubStrategy from 'passport-github2';
import local from 'passport-local';
import { userModel } from '../DAO/mongoDB/models/user.model.js';
import { createHash, isValidPassword, generateToken } from '../utils.js';
import config from './config.js';

const { KEY, CLIENTID, CLIENTSECRET, CALLBACKURL, ADMINUSER, ADMINPASS } = config;

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;

const cookieExtractor = req => {
    let token = (req?.cookies) ? req.cookies['cookieUS'] : null;
    if (!token) {
        token = req?.headers?.token;
    }
    return token;
};

const initializePassport = () => {
    
    // autenticación con GitHub
    passport.use('github', new GitHubStrategy({
        clientID: CLIENTID,
        clientSecret: CLIENTSECRET,
        callbackURL: CALLBACKURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                user = {
                    name: profile._json.name,
                    last_name: 'Last name Github',
                    email: profile._json.email,
                    age: 1,
                    password: 'Password Github'
                };
                const result = await userModel.create(user);
                user._id = result._id;
            }
            const token = generateToken(user);
            user.token = token;
            return done(null, user);
        } catch (error) {
            return done(new Error('Error login with github'));
        }
    }));

    // autenticación con JWT
    passport.use('current', new JWTStrategy({
        secretOrKey: KEY,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([cookieExtractor])
    }, (jwt_payload, done) => {
        return done(null, jwt_payload);
    }));

    // registro local
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { name, email, age, last_name } = req.body;
        try {
            const user = await userModel.findOne({ email: username });
            if (user) {
                return done(null, false, { message: 'User already exists' });
            }
            const newUser = {
                name: name,
                last_name: last_name,
                email: email,
                age: age,
                password: createHash(password)
            };
            if (email == ADMINUSER && password != ADMINPASS) {
                return done(null, false, { message: 'Wrong email or password' });
            }
            if (email == ADMINUSER && password == ADMINPASS) {
                newUser.role = 'admin';
            }
            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(new Error('Error with registration'));
        }
    }));

    // autenticación local
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (!user || !isValidPassword(user, password)) {
                    return done(null, false, { message: 'Incorrect email or password' });
                }
                const token = generateToken(user);
                user.token = token;
                return done(null, user);
            } catch (error) {
                return done(new Error('Error logging in'));
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;