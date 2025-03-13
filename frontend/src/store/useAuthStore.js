import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser:null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth:true,
    onlineUsers:[],

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
        } catch (error) {
            set({authUser:null})
        } finally{
            set({isCheckingAuth: false})
        }
    },
    signup: async (data)=>{
        set({isSigningUp: true})
        try {
            // Mandamos la informacion del usuario al backend para recibir respuesta
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success('Cuenta creada correctamente');

        } catch (error) {
            toast.error("Algo paso mal, favor de revisar: " + error.response.data.message)
        } finally{
            set({isSigningUp: false})
        }
    },
    login: async(data)=>{
        set({isLoggingIng: true})
        try {
            //Mandamos al usuario al backend de iniciar sesion
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser : res.data})
            toast.success("Sesion correctamente iniciada")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoggingIng: false})
        }
    },


    logout: async () =>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("cuenta cerrada correctamente");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) =>{
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put('/auth/update-profile', data)
            set({authUser: res.data});
            toast.success('Actualizaste la foto correctamente');

        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isUpdatingProfile: false})
        }
    }

}));
