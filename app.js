var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/chess');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(3000);


function convertPGNtoJSON(pgn){
    var details = pgn.match(/\[(.*)\]/g);
    var data = {};
    for(var i = 0; i < details.length; i++){
        var temp = details[i].replace(/(\[|\])/g, "");
        var key = temp.substring(0, temp.indexOf(" ")).toLowerCase();
        var value = temp.substring(temp.indexOf(" ")+1).replace(/(")/g, "");
        data[key] = value;
    }

    var movestemp = pgn.split(/\d*\. /g);
    var moves = [];
    for(var i = 1; i < movestemp.length; i++){
        var temp = movestemp[i].trim().split(" ");
        moves.push(temp.join("$"));
    }
    data["moves"] = moves; 
    // console.log(data);
    // console.log("db.pgnchess.insert(" + JSON.stringify(data) + ");");
    return data;
}

io.sockets.on('connection', function(socket){
  socket.on('sendedit', function(gamedata){
    io.sockets.emit('updateedit', gamedata);
  });
  socket.on('sendgame', function(gamedata){
    io.sockets.emit('newgame', convertPGNtoJSON(gamedata));
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
