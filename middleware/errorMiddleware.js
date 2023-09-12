// const multer = require('multer');
// const notFound = (req, res, next) => {
//     const error = new Error(`Not Found - ${req.originalUrl}`);
//     res.status(404);
//     next(error);
//   }

// const errorHandler =(err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//       // Multer error occurred during file upload
//       return res.status(400).json({ message: 'Multer Error: '});
//   }
//   else{
//   // Handle other errors here
//   console.error(err);
//   res.status(err.status || 500).json({ message: err.message || 'Server Error' });
//   }
// };

  // module.exports ={notFound, errorHandler}