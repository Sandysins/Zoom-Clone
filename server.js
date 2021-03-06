const express = require('express')
const app=express();
const server = require('http').Server(app)
const path = require("path")
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req,res)=>{
  res.redirect(`${uuidv4()}`);
})
app.get('/:rooom', (req,res)=>{
  res.render('room',{ roomId: req.params.room });
})

io.on('connection', socket =>{
  socket.on('join-room', (roomId, userId)=>{
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected',userId);
    socket.on('message',message=>{
      io.to(roomId).emit('createMessage',message)
    })
  })
})


server.listen(3030,()=>{
  console.log("Running at port 3030")
});