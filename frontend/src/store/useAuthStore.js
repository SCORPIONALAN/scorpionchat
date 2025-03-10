import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser:null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

    isCheckingAuth:true,
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
            toast.success("Cuenta creada sin problemas");

        } catch (error) {
            toast.error("Algo paso mal, favor de revisar: " + error.response.data.message)
        } finally{
            set({isSigningUp: false})
        }
    },
    logout: async () =>{
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("cuenta cerrada correctamente");
        } catch (error) {
            toast.error("Algo paso mal, favor de revisar: " + error.response.data.message)
        }
    }
}))