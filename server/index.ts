import express from "express";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(express)
const io: Server = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 5000

io.on('connection', (socket) => {
  console.log('User Connected')


  socket.on('hello', () => {
    console.log('got hello from client')
    socket.emit('hello-response')
  })
  

  socket.on('disconnect', () => {
  })
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
