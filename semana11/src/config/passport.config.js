import passport from 'passport'
import local from 'passport-local';
import GitHubStrategy from 'passport-github2'
import userModel  from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {



    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.45aaf3c9b161f671',
        clientSecret: '351d175bfa9432c843f96dd29a48884265cba3bf',
        callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                console.log('Ya se encuentra registrado')
                return done(null, user)
            }

            const newUser = await userModel.create({
                name: profile._json.name,
                last_name: 'Last name Github',
                email: profile._json.email,
                age: 1,
                password: 'Password Github'
            })

            return done(null, newUser)

        } catch (error) {
            return done('Error to login with github ' + error)
        }
    }));



    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { name, email,age, last_name } = req.body
        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('User already exits')
                return done(null, false)
            }

            const newUser = {
                name:name,
                last_name:last_name,
                email: email,
                age: age,
                password: createHash(password)
            }

            if (email == 'adminCoder@coder.com' && password != 'adminCod3r123') {
                return   done('Error Email ')
            }

            if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
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
                const user = await userModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User does not exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('password not valid')
                    return done(null, false)
                }

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