import passport from 'passport';
import passportJWT from 'passport-jwt';
import GitHubStrategy from 'passport-github2'
import local from 'passport-local';
import userModel from '../dao/models/users.model.js'
import { createHash, isValidPassword, generateToken } from '../utils.js';
import config from './config.js';

const { KEY, CLIENTID, CLIENTSECRET, CALLBACKURL, ADMINUSER, ADMINPASS } = config

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;

const cookieExtractor = req => {
    const token = (req?.cookies) ? req.cookies['cookieUS'] : null
    return token
}

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: CLIENTID,
        clientSecret: CLIENTSECRET,
        callbackURL: CALLBACKURL
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                user = {
                    name: profile._json.name,
                    last_name: 'Last name Github',
                    email: profile._json.email,
                    age: 1,
                    password: 'Pasword Git hub'
                }

                const result = await userModel.create(user);

                console.log('User registered succefully  👌');
                user._id = result._id
            }

            const token = generateToken(user);
            user.token = token

            return done(null, user)

        } catch (error) {
            return done('Error to login with github ' + error)
        }
    }));

    passport.use('current', new JWTStrategy({
        secretOrKey: KEY,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([cookieExtractor])
    }, (jwt_payload, done) => {
        return done(null, jwt_payload)
    }))

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { name, email, age, last_name } = req.body
        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('User already exits')
                return done(null, false)
            }

            const newUser = {
                name: name,
                last_name: last_name,
                email: email,
                age: age,
                password: createHash(password)
            }

            if (email == ADMINUSER && password != ADMINPASS) {
                return done('Error Email ')
            }

            if (email == ADMINUSER && password == ADMINPASS) {
                newUser.role = 'admin'
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch (error) {
            done('Error to register ' + error)
        }
    }));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })
                if (!user) {
                    console.error('User doent exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('password not valid');
                    return done(null, false)
                }

                const token = generateToken(user);
                user.token = token

                return done(null, user)
            } catch (error) {
                return done('Error login ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport