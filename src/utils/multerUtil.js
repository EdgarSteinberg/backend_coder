import multer from 'multer';
import path from 'path'; //borralo
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
    // filename: (req, file, cb) => {
    //     cb(null, file.originalname);
    // }
    filename: (req, file, cb) => {
        // Genera un nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const uploader = multer({ storage });
