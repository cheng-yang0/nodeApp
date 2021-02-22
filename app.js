const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');/*post方法*/
const expressJwt=require('express-jwt');
const app = express();
app.use(express.json({limit: '50mb'}))
// app.use(expressJwt({
//   secret:'secret12345',
//   algorithms:['HS256'],
// }).unless({
//   path:['/user/login','/user/register','/socketPort']
// }))
app.use(express.static(path.resolve('../media')));
app.use(bodyParser.json());// 添加json解析
app.use(bodyParser.urlencoded({extended: false}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const socketRouter=require('./routes/socket.js')
const mediaRouter=require('./routes/media.js')
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/socket',socketRouter);
app.use('/media',mediaRouter);
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
module.exports = app;
