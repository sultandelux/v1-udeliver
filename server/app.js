require('dotenv').config()
const express = require('express');
const app = express();
const server = require('https').Server(app);
const io = require('socket.io')(server);
const serveStatic = require('serve-static')
const path = require('path')

app.use('/', serveStatic(path.join(__dirname, '../dist')))
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// app.use('/',require('./routes/index'))


const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server Started on port: ${PORT}`));

io.on('connect',(socket)=>{
    console.log("User " + socket.id + " connected to default ");
  
    socket.on("manual-disconnection", function(data) {
        console.log("User Manually Disconnected.]\n\t ID: " + data);
    })
    socket.on('disconnect',(data)=>{
        console.log('User Disconnected', data, socket.id)
        io.to('default').emit('disconnectedUser', socket.id)        
    })
    socket.on('subscribe',(data)=>{
        console.log(`User want to join: ${data.room}`)
        socket.join(data.room)
        io.to(data.room).emit('message',`user joined ${socket.id}`)
    })
    socket.on('send:coords',(data)=>{
        console.log(`received:${data.coord}`)
        io.to(data.room).emit('load:coords',data)
    })
    
})

const mySpace  = io.of('/new-namespace');
mySpace.on('connection',function(socket){
    console.log('someone connected to new namespace');
    socket.emit('message',"socket 2");
});
