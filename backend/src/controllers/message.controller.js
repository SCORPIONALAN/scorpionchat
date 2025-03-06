import User from "../models/user.model";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async(req, res)=>{
    try {
        const loggedInUserId = req.user._id;
        //Buscame todos los usuarios a excepcion del que esta logeado, y traeme toda su informacion a excepcion de la password
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error en obtener los usuarios del sideBar: ", error.message);
        res.status(500).json({message:"Error en el servidor"});
    }
}

export const getMessages = async (req, res) =>{
    try {
        //Obtenemos los parametros del endpoint que en este caso es el id, destructuramos y cambiamos el nombre
        const {id:userToChatId} =req.params;
        const myId = req.user._id;
        // Buscame todos los mensajes donde los manda el que manda o el que recive
        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.error("Error en el controlador de obtener mensajes: ", error.message);
        res.status(500).json({error:"Error interno del servidor"});
    }
}

export const sendMessage = async (req, res) =>{
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        //En caso de cargar una imagen, mandar a cloudinary
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        //          LAS FUNCIONALIDADES DE TIEMPO REAL CON SOCKET.IO
        res.status(201).json(newMEssage);
    } catch (error) {
        console.error("Error en el controlador de mandar mensajes: ", error.message);
        res.status(500).json({error:"Error interno del servidor"});
    }
}