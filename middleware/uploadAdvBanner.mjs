import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads/pixel_img');
    },
    filename: (req, file, cb) => {
        cb(null,  file.originalname);
    }
});

const fileFilter = (file) => {
    const allowedExtensions = ['.jpeg', '.png', '.jpg','.webp'];
    console.log(file.mimetype)
    return allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
  };
const upload = multer({ storage: storage, fileFilter: (req, file, cb) => {
    if (fileFilter(file)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file extension. Only jpeg, png, jpg and webp are allowed.'));
    }
  } });

export default upload