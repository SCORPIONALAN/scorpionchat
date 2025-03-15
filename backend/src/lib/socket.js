import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

// Para almacenar usuarios en linea
const userSocketMap ={};
io.on('connection', (socket)=>{
    console.log('Un usuario se ha conectado', socket.id);
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    // Mandar eventos de forma broadcast
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on('disconnect', ()=>{
        console.log('Un usuario se desconecto', socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})
export {io, app, server}