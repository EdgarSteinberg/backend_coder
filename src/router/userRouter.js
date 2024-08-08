import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { userController } from '../controllers/userController.js';
import CurrentDTO from '../dao/dto/currentDTO.js';

import addLogger from '../logger.js'
import { authorization } from '../middlewares/authorization.js';
import { uploader } from '../utils/multerUtil.js';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const Users = new userController();
const UserRouter = Router();

UserRouter.get('/', async (req, res) => {
    const result = await Users.getAllUsers()
    res.send({ status: 'succes', payload: result })
})

UserRouter.post('/register', addLogger, async (req, res, next) => {
    try {
        const user = await Users.register(req.body);

        if (process.env.NODE_ENV === 'test') {
            return res.status(201).send({ status: 'success', payload: user });
        }
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register')
        req.logger.error(`Error al registrarse: ${error.message}`);
        next(error);
    }
});

UserRouter.post('/login', addLogger, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`);
        const token = await Users.login(email, password);

        res.cookie('auth', token, { maxAge: 60 * 60 * 1000 });
        if (process.env.NODE_ENV === 'test') {
            return res.status(201).send({ status: 'success', payload: { user: req.user, token } });
        }
        res.redirect('/');
    } catch (error) {
        res.redirect('/?loginFailed=true')
        req.logger.error(`Error al iniciar sesion: ${error.message}`)
        next(error)

    }
});
// UserRouter.post('/login', addLogger, async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         console.log(`Login attempt for email: ${email}`);
//         const token = await Users.login(email, password);

//         res.cookie('auth', token, { maxAge: 60 * 60 * 1000 });

//         if (process.env.NODE_ENV === 'test') {
//             return res.status(201).send({ status: 'success', payload: { user: req.user, token } });
//         }

//         res.redirect('/'); // Redirige con un parámetro de consulta
//     } catch (error) {
//         req.logger.error(`Error al iniciar sesión: ${error.message}`);
//         res.redirect('/?loginFailed=true'); // Redirige con un parámetro de consulta en caso de error
//     }
// });



UserRouter.get('/current', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const userDTO = new CurrentDTO(req.user)
    res.send({ status: 'succes', payload: { user: userDTO } });
});

UserRouter.get('/:uid', passport.authenticate('jwt', { session: false }), authorization(["admin"]), async (req, res) => {
    try {
        const user = await Users.getUser(req.params.uid);
        res.send({ status: 'success', payload: user });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

UserRouter.post('/logout', async (req, res) => {
    try {
        const token = req.cookies.auth;
        const decoded = jwt.verify(token, SECRET_KEY);
        const email = decoded.email;

        // Actualizar last_connection
        await Users.updateLastConnection(email);
        console.log(`User ${email} logged out at ${new Date()}`); // Registro en consola

        res.clearCookie('auth'); // Borra la cookie de autenticación
        res.redirect("/login"); // Redirige al usuario a la página de inicio de sesión
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});

UserRouter.post('/recover-password', async (req, res) => {
    const { email } = req.body;

    try {
        await Users.requestPasswordReset(email);
        res.redirect('/check-email');
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ status: 'error', message: 'Error en el envío del correo' });
    }
});


UserRouter.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    console.log('Token recibido en el formulario:', token)
    if (!token) {
        return res.status(400).send({ status: 'error', message: 'Token no proporcionado' });
    }

    try {
        await Users.resetPassword(token, newPassword);
        res.redirect('/login');

    } catch (error) {
        console.error(error.message);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(400).send({ status: 'error', message: 'El enlace ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.' });
        } else {
            return res.status(500).send({ status: 'error', message: error.message });
        }
    }
});

UserRouter.put('/premium/:uid', passport.authenticate('jwt', { session: false }), authorization(["admin"]), async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        // Verificar si el rol enviado es válido
        if (role !== 'user' && role !== 'premium') {
            return res.status(400).send({ error: 'El rol especificado no es válido' });
        }

        // Obtener el usuario
        const user = await Users.getUser(uid)
        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        // Verificar si el usuario quiere pasar a premium y si tiene los documentos requeridos
        if (role === 'premium' && user.documents.length < 3) {
            return res.status(400).send({ error: 'El usuario no ha terminado de procesar su documentación' });
        }

        // Cambiar el rol del usuario
        const updatedUser = await Users.updateUser(uid, { role });
        if (!updatedUser) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        res.status(200).send({ message: `Rol del usuario ${uid} actualizado a ${role}` });
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});

UserRouter.post('/:uid/documents', passport.authenticate('jwt', { session: false }), uploader.array('docs', 3), async (req, res) => {
    const { uid } = req.params;
    const documents = req.files.map(file => ({
        name: file.fieldname,
        reference: file.filename
    }));

    if (!documents || documents.length === 0) {
        return res.status(400).send({ status: 'error', error: 'No documents uploaded' });
    }

    try {
        // Obtener el usuario
        const user = await Users.getUser(uid)
        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }
        // Combinar documentos existentes con nuevos documentos
        const updatedDocuments = [...user.documents, ...documents];

        // Actualizar los documentos del usuario
        const result = await Users.uploadDocuments(uid, updatedDocuments);

        res.redirect('/login')
    } catch (error) {
        console.error('Error en la ruta:', error);
        res.status(500).send({ status: 'error', error: 'Unhandled error', details: error.message });
    }

});

UserRouter.delete('/', passport.authenticate('jwt', { session: false }), authorization(["admin"]), async (req, res) => {
    try {
        const result = await Users.deleteInactiveUsers();
        res.send(result);
    } catch (error) {
        console.error('Error en la ruta DELETE /:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});

UserRouter.delete('/:uid', passport.authenticate('jwt', { session: false }), authorization(["admin"]), async (req, res) => {
    const uid = req.params.uid
    try {
        const result = await Users.deleteUser(uid);
        if (!result) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.send({ status: 'success', message: 'Usuario eliminado correctamente' })
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'Error al eliminar el usuario' })
    }
});

export default UserRouter;