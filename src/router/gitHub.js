
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login', session: false }), (req, res) => {
    if (req.user && req.user.token) {
        res.cookie('auth', req.user.token, { maxAge: 60 * 60 * 1000 }).redirect('/');
    } else {
        res.redirect('/login');
    }
});

export default router;
