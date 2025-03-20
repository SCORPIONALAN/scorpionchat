import express from 'express';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import dotenv from "dotenv";
import {connectDB} from './lib/db.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { app, server } from './lib/socket.js'; //Configuracion de express dentro de socketIO
import path from 'path';
dotenv.config();
//Configuraciones para aumentar la capcidad de subida
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const PORT = process.env.PORT;
// Para extraes los datos en formato JSON
//app.use(express.json())
const __dirname = path.resolve();

// Valga la redundancia sirve para parsear las cookies
app.use(cookieParser());

// hacer que el frontend mande peticiones al backend
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials: true
    }
))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production" ){
    //Una vez dentro de un entorno de produccion concatenar lo armado del frontend con el backend
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    //EntryPoint de la aplicacion realizada en react
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
    })
}


server.listen(PORT, () => {
    console.log("server running on port " + PORT);
    connectDB();
});
