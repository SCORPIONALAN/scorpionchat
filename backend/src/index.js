import express from 'express';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import dotenv from "dotenv";
import {connectDB} from './lib/db.js';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
// Para extraes los datos en formato JSON
app.use(express.json())

// Valga la redundancia sirve para parsear las cookies
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes)


app.listen(PORT, () => {
    console.log("server running on port " + PORT);
    connectDB();
});
