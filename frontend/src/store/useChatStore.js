import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set, get)=>({
    messages:[],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () =>{
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get('/messages/users')
            set({users: res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUserLoading: false});
        }
    },

    getMessages: async (userId) =>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isMessagesLoading: false})
        }
    },
    sendMessage: async(data) =>{
        // De aqui mismo regresame estos datos
        const {selectedUser, messages} = get();
        try {
            //accede al endpoint para hacer peticion post
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);
            //Guarda los mensajes anteriores y agrega este nuevo
            set({messages:[...messages, res.data]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    /*      TODO                
        Optimizar esta linea de codigo
    */
    setSelectedUser: (selectedUser) => set({selectedUser})
})) 