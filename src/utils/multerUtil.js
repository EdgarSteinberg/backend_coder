// import multer from 'multer';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let folder = 'public/img'; // Default folder
//         if (file.fieldname === 'docs') {
//             folder = 'public/documents';
//         } else if (file.fieldname === 'profile') {
//             folder = 'public/profile';
//         }
//         cb(null, folder);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

// export const uploader = multer({ storage });

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'public/img'; // Default folder
        if (file.fieldname === 'docs') {
            folder = 'public/documents';
        } else if (file.fieldname === 'profile') {
            folder = 'public/profile';
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único del archivo
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

export const uploader = upload;
