import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/author-profiles');
    },
    filename: (req, file, cb) => {
      console.log('file----------->', file.originalname)
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
      console.log('file----------->', file.originalname)

      cb(null, true);
    } else {
      cb(new Error('Invalid file extension. Only jpeg, png, jpg and webp are allowed.'));
    }
  } });

export default upload