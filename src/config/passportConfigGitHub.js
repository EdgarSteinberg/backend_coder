import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const SECRET_ID = process.env.GITHUB_CLIENT_SECRET;
const SECRET_KEY = process.env.SECRET_KEY;

const initializeGitHubPassport = () => {
    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: CLIENT_ID,
                clientSecret: SECRET_ID,
                callbackURL: 'http://localhost:8080/api/gitHub/githubcallback'
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);
                    const email = profile._json.email || `${profile._json.login}@github.com`;

                    let user = await userModel.findOne({ $or: [{ email }, { username: profile.username }] }).lean();

                    if (!user) {
                        let newUser = {
                            username: profile._json.login,
                            name: profile._json.name,
                            email: email,
                            password: ""
                        };
                        const result = await userModel.create(newUser);
                        console.log('Nuevo usuario creado:', result);

                        const token = jwt.sign({ _id: result._id, email: result.email, username: result.username }, SECRET_KEY, { expiresIn: '1h' });
                        console.log('Token generado:', token);

                        done(null, { user: result, token });
                    } else {
                        const token = jwt.sign({ _id: user._id, email: user.email, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
                        console.log('Token generado para usuario existente:', token);
                        done(null, { user, token });
                    }
                } catch (error) {
                    console.error('Error en estrategia de GitHub:', error);
                    done(error);
                }
            }
        )
    );

   
    passport.serializeUser((user, done) => {
        done(null, user.user ? user.user._id : user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
};
export default initializeGitHubPassport;
