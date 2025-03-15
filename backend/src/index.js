import express from 'express';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import dotenv from "dotenv";
import {connectDB} from './lib/db.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { app, server } from './lib/socket.js'; //Configuracion de express dentro de socketIO

dotenv.config();

const PORT = process.env.PORT;
// Para extraes los datos en formato JSON
app.use(express.json())

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
app.use("/api/messages", messageRoutes)


server.listen(PORT, () => {
    console.log("server running on port " + PORT);
    connectDB();
});
