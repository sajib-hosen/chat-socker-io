// server/index.js
const express = require('express');
const app = express();
const cors = require('cors');

const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer(app);
const port = process.env.PORT || 4000;

app.use(cors()); // Add cors middleware


const io = new Server(server, {  // Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
});


app.get('/', (req, res) => {
    res.send('THE SERVER IS RUNNING ;-)');
});


const activeUsers = {};

io.on('connection', (socket) => {
    console.log(`connected user id:  ${socket.id}`);

    socket.on("loggedIn", (userData)=>{
        activeUsers[userData.mySocketId] = userData;
        io.emit("activeUsers", activeUsers ) // to all clients in the current namespace except the sender
    })

    socket.on("disconnect", ()=>{
        delete activeUsers[`${socket.id}`];
        io.emit("activeUsers", activeUsers ) // to all clients in the current namespace except the sender
    })



});

server.listen(port, () =>{
    console.log( "'Server is running on port: ", port );
});


//   socket.emit(/* ... */);  // basic emit
//   socket.broadcast.emit(/* ... */);  // to all clients in the current namespace except the sender
//   socket.to("room1").emit(/* ... */);  // to all clients in room1 except the sender
//   socket.to("room1").to("room2").emit(/* ... */);  // to all clients in room1 and/or room2 except the sender
//   io.in("room1").emit(/* ... */);  // to all clients in room1
//   io.of("myNamespace").emit(/* ... */);  // to all clients in namespace "myNamespace"
//   io.of("myNamespace").to("room1").emit(/* ... */);  // to all clients in room1 in namespace "myNamespace"
//   io.to(socketId).emit(/* ... */);  // to individual socketid (private message)
//   io.local.emit(/* ... */);  // to all clients on this node (when using multiple nodes)
//   io.emit(/* ... */);  // to all connected clients