var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session =  require('express-session');
var index = require('./routes/index');
var me = require('./routes/me');
var auth = require('./routes/auth');
var bureau = require('./routes/bureau');
var permission = require('./routes/permissions');
var post = require('./routes/post')
var like = require('./routes/like')
var comment = require('./routes/comment')
var project = require('./routes/project')
var task = require('./routes/task')
var chatroom = require('./routes/chatroom')
var message = require('./routes/message')
var upload = require('./routes/upload')
var mission = require('./routes/mission')
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();

require('./config/passport')(passport);

var app = express();

// DB Connection
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (e) => e==null?console.log("Connected DB"):console.log(e.message)
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// các cài đặt cần thiết cho passport
app.use(session({secret: process.env.SECRET_KEY})); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
  res.sendFile(__dirname);
});
app.use('/', index);
app.use('/me',  me);
app.use('/user', auth);
app.use('/bureau', bureau);
app.use('/permission', permission);
app.use('/post', post);
app.use('/react', like);
app.use('/comment', comment);
app.use('/project', project);
app.use('/task', task);
app.use('/chatroom', chatroom);
app.use('/message', message);
app.use('/upload', upload);
app.use('/mission', mission);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send({message:err.message});
});


module.exports = app;