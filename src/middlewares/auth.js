import jwt from 'jsonwebtoken';

import userModel from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
    const token = req.cookies.auth;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, 'coderSecret');
        const user = await userModel.findById(decoded._id).lean();


        if (!user || !user.email) {
            throw new Error('Usuario no definido o sin correo electrónico'); // Maneja el error si no hay usuario o email
        }

        req.user = user;
        console.log('Usuario autenticado:', user);
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        return res.redirect('/login');
    }
};
export const publicRoute = function (req, res, next) {
    if (req.cookies.auth) {
        return res.redirect("/profile");
    }

    next();
};




