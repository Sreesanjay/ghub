const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/Images/Products'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

module.exports= multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/webp'
    ) {
      cb(null, true); // Allow the upload
    } else {
      const error = new Error('Unsupported file format');
      error.status = 400; // Set an appropriate HTTP status code
      cb(error); // Pass the error to multer
    }
  },
}).fields([{ name: 'prod_img_1', maxCount: 1 }, { name: 'prod_img_2', maxCount: 3 }]);
 
 