import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

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
    //Para cargar al contenedor del chat y que este en tiempo real
    subscribeToMessages: () =>{
        const {selectedUser} = get();
        if(!selectedUser) return; // si no hay usuario retorna
        const socket = useAuthStore.getState().socket; // pasar el socket de authStore hasta aqui
        socket.on('newMessage', (newMessage) =>{
            if(newMessage.senderId !== selectedUser._id) return; //Si yo usuario 1 le mando mensaje a usuario 2, pero usuario 3 esta chateando, esta linea de codigo evita que usuario 3 vea mis mensajes o los mensajes de 2
            set({messages:[...get().messages, newMessage]}) // Pasamos todos los mensajes y agregamos el nuevo al final
        })

    },
    //Para cuando cerramos la pestania
    unsubscribeToMessages:() => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },
    setSelectedUser: (selectedUser) => set({selectedUser})
})) 