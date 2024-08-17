import multer from 'multer';

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
        cb(null, file.originalname);
    }
});

export const uploader = multer({ storage });
