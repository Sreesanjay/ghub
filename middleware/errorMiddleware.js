const notFound = (req, res, next) => {
     res.status(404);
     res.render("404NotFound", { fullScreen: true });
};

const errorHandler = (err, req, res, next) => {
     // console.log(err)
     console.log(err);
     err.statusCode = err.statusCode || 500;
     err.status = err.status || "error";
     res.status(err.statusCode).json({
          error: err.status,
          message: err.message || "Internal server error",
     });
};

module.exports = { notFound, errorHandler };
