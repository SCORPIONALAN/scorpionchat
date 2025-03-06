import {v2 as cloudinary} from "cloudinary";
import {config} from 'dotenv';

config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export default cloudinary;
/*  ES CON EL FIN DE CONSUMIR UNA API QUE NOS PERMITIRA GUARDAR IMAGENES
    EN LA NUBE.
*/