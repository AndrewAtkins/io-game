const express = require('express');
const path = require('path');
var app = express();
// socket io setup
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// logic for server side game
let gameLogic = require('./lib/gameLogic');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set port app will run on
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.render('home');
});

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

http.listen(app.get('port'), function () {
	console.log('Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.');
});

io.on('connection', gameLogic.playerInput);

// Add the WebSocket handlers
io.on('connection', gameLogic.disconnectPlayer);

setInterval(function () {
	io.sockets.emit('state', gameLogic.state);
}, 1000 / 60);
