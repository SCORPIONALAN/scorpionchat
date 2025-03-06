import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Accion no autorizada - No existe token"});
        }
        // Necesitaremos decodificar el token
        // Primer parametro es la cookie y el segundo es el secreto que usamos en .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message:"Accion no autorizada - El token no existe"});
        // Regresamos todo al cliente a excepcion de la password por motivos de seguridad
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({message:"El usuario no existe :/"});
        req.user = user;
        next();
    } catch (error) {
        console.log("Error en el middleware", error.message);
        res.status(500).json({message:"Error interno del servidor"})
    }
};