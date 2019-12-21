require('dotenv').config()
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const serveStatic = require('serve-static')
const path = require('path')

//routes middleware

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

//here we are configuring dist to serve app files
// app.use('/', serveStatic(path.join(__dirname, '../dist')))

// this * route is to serve project on different page routes except root `/`
// app.get(/.*/, function (req, res) {
// 	res.sendFile(path.join(__dirname, '../dist/index.html'))
// })

const PORT = process.env.PORT || 8080;

//start a  HTTP server 
server.listen(PORT, console.log(`Server Started on port: ${PORT}`));

//socket server
//default namespace

io.on('connect',(socket)=>{
    console.log('someone Connected to Default namespace');
    socket.send('Thanks for Connecting'); //side-note: socket.send is equivelent tp socket.emit('message')

    //listen if socket connection is closed by client
    socket.on('disconnect',()=>{
        console.log('User Disconnected')
    });

    //listen for subscribe event to a room
    socket.on('subscribe',(data)=>{
        console.log(`User want to join: ${data.room}`);
        
        //join the room
        socket.join(data.room);

        //publish message event to joined room.
        io.to(data.room).emit('message','Hello I am New in room: ',data.room);

    });

    //listen if client trigger send:coords event
    socket.on('send:coords',(data)=>{
        console.log(`received:${data.coord}`);
        //foward data to all user joined the same room
        io.to(data.room).emit('load:coords',data);
    });
    
});

//custom namespace 
const mySpace  = io.of('/new-namespace');
mySpace.on('connection',function(socket){
    console.log('someone connected to new namespace');
    socket.emit('message',"Welcome to Socket 2");
});
