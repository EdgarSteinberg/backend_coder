
export const authorization = (roles) => {
    return (req, res, next) => {
        console.log('User role:', req.user?.role); // Verificar el rol del usuario
        if (req.user && roles.includes(req.user.role)) {
            return next();
        }

        res.redirect('/notFound');
    };
};

