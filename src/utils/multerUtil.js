// import multer from 'multer';
// import __dirname from './constantsUtil';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let folder = 'public/img'; // Default folder
//         if (file.fieldname === 'docs') {
//             folder = 'public/documents';
//         } else if (file.fieldname === 'profile') {
//             folder = 'public/profile';
//         }
//         //cb(null, folder);
//         cb(null,(`${__dirname} '../../'`, folder));
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

// export const uploader = multer({ storage });

import multer from 'multer';
import path from 'path';
import __dirname from './constantsUtil.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'public/img'; // Carpeta predeterminada
        if (file.fieldname === 'docs') {
            folder = 'public/documents';
        } else if (file.fieldname === 'profile') {
            folder = 'public/profile';
        }
        // Construir la ruta completa usando path.join y __dirname
        const fullPath = path.join(__dirname, '../../', folder);
        console.log(`Ruta de carga de archivo: ${fullPath}`); // Mensaje de depuración (opcional)
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const uploader = multer({ storage });
