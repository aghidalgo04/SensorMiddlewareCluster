var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveIndex = require('serve-index');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.raw())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var tokens = 0;
var time = new Date().getTime();
function rateLimiter(req, res, next){
  const tokensSegundo = 2;
  const tokensMax = 4;
  var tiempoTranscurrido = new Date().getTime() - time;
  
  tokens += tiempoTranscurrido / 1000 * tokensSegundo;
  time = new Date().getTime();
  if(tokens > tokensMax){
    tokens = tokensMax;
  }

  if(tokens >= 1){
    tokens -= 1;
    next();
  } else {
    res.sendStatus(429);
  }
}

app.use('/', rateLimiter, indexRouter);
app.use('/users', usersRouter);
app.use('/logs', serveIndex(path.join(__dirname, 'public/logs'))); // shows you the file list
app.use('/logs', express.static(path.join(__dirname, 'public/logs'))); // serve the actual files

//to include images
// app.use('/images', express.static('images'));

// catch 404 and forward to error handler
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let port = process.argv[2]
console.log("Usando puerto " + port)

app.listen(port, () => {
  console.log(`Server is running`);
});

module.exports = app;
