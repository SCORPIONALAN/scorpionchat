import cloudinary from "../lib/cloudinary.js";
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

export const login = async (req, res) => {
    const{email, password}=req.body;
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({message:"credenciales inexistentes"});
        // La primera es la que esta aqui y el segundo argumento es de la base de datos
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(404).json({message:"credenciales inexistentes"});
        generateToken(user._id, res);
        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error dentro del controlador del login", error.message);
        res.status(500).json({message: "error dentro del servidor"});
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "saliendo de tu sesion de forma exitosa!"});
    } catch (error) {
        console.log("Error dentro del controlador del login", error.message);
        res.status(500).json({message: "error dentro del servidor"});
    }
}

export const updateProfile = async (req, res) =>{
    try {
        const {profilePic} = req.nody;
        const userId = req.user._id;
        if(!profilePic) return res.status(400).json({message: "La foto de perfil es obligatoria"});
        //Como cloudinary va a servir como nuestro respaldo de imagenes, tenemos que mandar a mongo la direccion URL
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true});
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error en actualizar el perfil", error);
        res.status(500).json({message: "Error interno dentro del servidor"});
    }
}

export const checkAuth = (req,res) =>{
    try {
        //Envia al usuario de nuevo al cliente
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error en la autenticacion", error.message)
        res.status(500).json({message:"Error del servidor"})
    }
}