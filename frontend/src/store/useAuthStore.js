import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client'
import { useChatStore } from './useChatStore';

const BASE_URL= import.meta.env.MODE === 'development'? 'http://localhost:5001' : '/';
export const useAuthStore = create((set, get) => ({
    authUser:null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket: null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
            get().connectSocket();
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
            get().connectSocket();
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
            toast.success("Sesion correctamente iniciada");

            get().connectSocket();
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
            get().disconnectSocket();
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
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isUpdatingProfile: false})
        }
    },
    connectSocket: () =>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id
            }
        });
        socket.connect();
        set({socket});

        socket.on("getOnlineUsers", (usersIds) => {
            set({onlineUsers: usersIds})
        });
        
        socket.on('ImageChange', ({ userId, profilePic }) => {
            console.log("Recibido cambio de imagen en tiempo real para:", userId);
        
            useChatStore.setState(state => ({
                users: state.users.map(user =>
                    user._id === userId ? { ...user, profilePic: profilePic } : user
                )
            }));
        });
        
    },
    disconnectSocket: () =>{
        if(get().socket?.connected) get().socket.disconnect() //Solo si estas conectado, intenta desconectarte
    },
}));
