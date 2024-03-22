const notFound = (req, res, next) => {
     res.status(404);
     res.render("404NotFound", { fullScreen: true });
};

const errorHandler = (err, req, res, next) => {
     if (err.name == 'BSONError') {
          return res.render('404NotFound', { fullScreen: true })
     }
     console.log(err)
     err.statusCode = err.statusCode || 500;
     err.status = err.status || "error";
     res.status(err.statusCode).json({
          error: err.status,
          message: err.message || "Internal server error",
     });
};

module.exports = { notFound, errorHandler };
