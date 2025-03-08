import express from 'express';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import dotenv from "dotenv";
import {connectDB} from './lib/db.js';
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();
const app = express();

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
app.use("/api/message", messageRoutes)


app.listen(PORT, () => {
    console.log("server running on port " + PORT);
    connectDB();
});
