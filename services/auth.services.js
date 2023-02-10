import passport from "passport";
import LocalStrategy from 'passport-local'
import User from "../modules/user/user.model.js";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv';
dotenv.config();

const localOpts = {
    usernameField: 'email'
}
const localStrategy = new LocalStrategy(localOpts, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        else if (!await user.matchPassword(password)) {
            return done(null, false)
        }
        return done(null, user);
    } catch (error) {
        return done(error, false)
    }
})

// Jwt strategy
const jwtOpts = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() - use Authorization: Bearer erererer'
    // jwtFromRequest: ExtractJwt.fromHeader('authorization') - use Authorization: ere5343fdff'
    // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt') -use Authorization: JWT fdfdfdfdfdfdf,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET
}

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
    try {
        const user = await User.findById(payload._id);
        // console.log(user);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(null, false);
    }
})


passport.use(localStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', { session: false })
export const authJWT = passport.authenticate('jwt', { session: false })