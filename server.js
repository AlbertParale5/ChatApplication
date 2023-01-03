
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {origin: "*"}
});
var Redis = require('ioredis');
var redis = new Redis();
var users = [];

redis.subscribe('private-channel', function(){
	console.log('subscribed to private channel');
});

redis.on('message', function(channel, message){
	console.log(channel);
	console.log(message);
});

io.on('connect', (socket) => {
	socket.on('user_connected', (user_id) => {
		users[user_id] = socket.id;
		io.emit('updateUserStatus', users);
		console.log('user connected ' + user_id);
	});

	socket.on('disconnect', function(){
		var i = users.indexOf(socket.id);
		users.splice(i, 1, 0);
		io.emit('updateUserStatus', users);
		console.log(users);

	})
});

server.listen(8005, () => {
	console.log('Listening to port 8005');
});