var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');

var sinhviensRouter = require('./routes/sinhviens');
var imagesRouter = require('./routes/images');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/v1/sinhviens', sinhviensRouter);
app.use('/images/', imagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode);
    res.json({ message: err.message, statusCode: statusCode });
});

module.exports = app;