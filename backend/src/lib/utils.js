import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // Para generar los tokens, requeriremos de las variables de entorno
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    });
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, //7 dias en ms
        httpOnly: true, // Previene de ataques XSS
        sameSite: "strict", // Previene del ataque CSRF
        secure: process.env.NODE_ENV !== "development" //Solo sera seguro hasta que estemos en produccion   
    })
    return token;
}