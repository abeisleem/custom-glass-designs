const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const flash = require('express-flash');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');

const indexRouter = require('./routes/index');
const homeRouter = require('./routes/home');
const aboutRouter = require('./routes/about');
const servicesRouter = require('./routes/services');
const photoGallRouter = require('./routes/photoGallery');
const finishGlassRouter = require('./routes/finishGlass');
const contactRouter = require('./routes/contact');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// "csrf({ cookie: true })" MUST come after "express.urlencoded({extended: false})"
const middleware = [
    cookieParser(),
    helmet(),
    logger('dev'),
    session({
        secret: 'super-secret-key',
        key: 'super-secret-cookie',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 }
    }),
    flash(),
    express.json(),
    express.urlencoded({extended: false}),
    express.static(path.join(__dirname, 'public')),
    csrf({ cookie: true })
];

app.use(middleware);

app.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    next();
});

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/about', aboutRouter);
app.use('/services', servicesRouter);
app.use('/photogallery', photoGallRouter);
app.use('/finish-glass', finishGlassRouter);
app.use('/contact', contactRouter);


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
  res.status(err.status || 500);
  res.render('error');
});

global.API_KEY = "AIzaSyB7UkVa3sS0ug8OlQMZHVP7oTFfQAufCnQ";

module.exports = app;
