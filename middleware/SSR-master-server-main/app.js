var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveIndex = require('serve-index');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ipFilter = require('express-ipfilter').IpFilter;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let ips = ['10.100.0.119', '10.50.0.0/16'];

let clientIp = function(req, res){
  return req.headers['x-forwarded-for'] ? (req.headers['x-forwarded-for']).split(',')[0] : "";
}

app.use(
  ipFilter(
    ips,
    {
     detectIp: clientIp,
     mode: 'allow'
    },
  )
)

app.use(express.raw())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logs', serveIndex(path.join(__dirname, 'public/logs'))); // shows you the file list
app.use('/logs', express.static(path.join(__dirname, 'public/logs'))); // serve the actual files


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
