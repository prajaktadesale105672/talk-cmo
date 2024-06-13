import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Function to generate destination folder path based on current year and month
const generateDestination = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // GetMonth is zero-based
    return path.join('../uploads', year.toString(), month);
};

// Function to create destination folder if it doesn't exist
const createDestinationIfNotExist = () => {
    const destination = generateDestination();
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }
    return destination;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = createDestinationIfNotExist();
    cb(null, destination);
},
filename: (req, file, cb) => {
    const destination = createDestinationIfNotExist();
    const filename = Date.now() + '-' + file.originalname;
    const fullPath = path.join(destination, filename);
    cb(null, filename);
}
});


const fileFilter = (file) => {
    const allowedExtensions = ['.jpeg', '.png', '.jpg','.webp'];
    // console.log(file.mimetype)
    return allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
  };
const upload = multer({ storage: storage, fileFilter: (req, file, cb) => {
    if (fileFilter(file)) {
      // console.log({file});
      // console.log('file----------->', file.originalname)

      cb(null, true);
    } else {
      cb(new Error('Invalid file extension. Only jpeg, png, jpg and webp are allowed.'));
    }
  } });

export default upload
