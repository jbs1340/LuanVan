var express = require('express');
var compression = require("compression")
var cors = require('cors')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
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
var market = require('./routes/market')
var relation = require('./routes/relation')
var tankinh = require('./routes/tankinh')
var hub = require('./routes/hub')
var notify = require('./routes/notify')
const passport = require('passport');
const mongoose = require('mongoose');
var axios = require('axios');
const e = require('express');
require('dotenv').config();
require('./config/passport')(passport)

var app = express();

// DB Connection
mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },
    (e) => e == null ? console.log("Connected DB") : console.log(e.message)
);

process.on('uncaughtException', (err, origin) => {
    axios.post(`http://api.telegram.org/bot1319027140:AAEC7QwlZRh_Vbygv352GtLwmc1gDa5a2a0/sendMessage?chat_id=-1001200490767&text= ! YUH crashed ${err.stack}`)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(compression());
process.env.NODE_ENV != "prd" ? app.use(logger("dev")) : null;
app.use(bodyParser.json({ limit: "51mb" }));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
process.env.PUBLIC_DIR = path.join(__dirname, 'public')
app.use(express.static(path.join(__dirname, 'public')));

// các cài đặt cần thiết cho passport
app.use(session({ secret: process.env.SECRET_KEY })); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

app.use('/me', me);
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
app.use('/market', market);
app.use('/relation', relation);
app.use('/tankinh', tankinh);
app.use('/hub', hub);
app.use('/notify', notify);

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
    var message = {}
    message.message = err.message
    message.status = err.status
    res.locals.error = req.app.get('env') === 'development' ? message : message = { message };

    // render the error page
    res.status(err.status || 500).send(message);
});


module.exports = app;