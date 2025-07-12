import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (userId) =>{
    if(!socket){
        socket = io('http://localhost:8000');
        socket.on('connect', ()=>{
            console.log("Socket connected: ", socket.id);
            socket.emit('register', userId)
        })
    }
}

export const getSockect = () => socket;