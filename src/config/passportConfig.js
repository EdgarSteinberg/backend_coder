import passport from 'passport';
import jwt, { ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';


const JWTStratergy = jwt.Strategy;

dotenv.config();
const secretOrKey = process.env.SECRET_KEY;

const initializatePassport = () => {
 
    // Estrategia de autenticación JWT
    passport.use(
        'jwt',
        new JWTStratergy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: secretOrKey
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
 
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.auth ?? null;
    }
    return token;
};


export default initializatePassport;



