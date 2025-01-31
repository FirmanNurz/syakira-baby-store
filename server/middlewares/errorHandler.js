const errorHandler = (err, req, res, next) => {
    console.log(err);
    let statusCode = 500;
    let message = 'Internal server error';

    if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = err.errors[0].message;
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'Unauthorized') {
        statusCode = 401;
        message = 'Invalid token or unauthorized access';
    }

    if (err.name === 'Forbidden') {
        statusCode = 403;
        message = 'Forbidden access';
    }

    if (err.name === 'NotFound') {
        statusCode = 404;
        message = 'Data not found';
    }

    if (err.name === 'LoginError') {
        statusCode = 401;
        message = 'Invalid email or password';
    }

    if (err.name === 'BadRequest') {
        statusCode = 400;
        message = 'Please check your input';
    }

    if (err.name === 'Conflict') {
        statusCode = 409;
        message = 'Data already exists';
    }

    res.status(statusCode).json({ message });
}

module.exports = errorHandler;