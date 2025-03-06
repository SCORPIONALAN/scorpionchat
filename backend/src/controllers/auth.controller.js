import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: "favor de llenar todos los campos"});
        }
        // hasheado de passwords (bcryptjs)
        if(password.length < 6){
            return res.status(400).json({message: "La password debe contener al menos 6 caracteres"});
        }
        // Verificar si existe un usuario con este email
        const user = await User.findOne({email});
        if (user) return res.status(400).json({message:"El usuario ya existe!!!"});
        // Para hacer un hasheado se debe generar una sal, la convencion es de 10
        const salt = await bcrypt.genSalt(10);
        // Esto ya es el hasheado pasando de parametros unicamente la password y la sal
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashPassword
        });
        if(newUser){
            // generamos el JWT
            generateToken(newUser._id, res)
            await newUser.save();
            //status 201 para indicar la creacion de algo
            res.status(201).json({
                _id:newUser._id,
                fullname: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            return res.status(400).json({message: "Que pena, hubo un problema al crear tu cuenta, intenta de nuevo"});
        }
    } catch (error) {
        console.log("Error en el controlador para iniciar sesion", error.message);
        return res.status(500).json({message: "Que pena, hubo un problema con el servidor"});
    }
}

export const login = (req, res) => {
    res.send("login route");
}
export const logout = (req, res) => {
    res.send("logout route");
}