import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { tiempoFormato } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeToMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const chatContainerRef = useRef(null); // Referencia del contenedor

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeToMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeToMessages]);

  // Animacion para irnos al ultimo mensaje
  useEffect(() => {
    const chatContainer = chatContainerRef.current; //Apuntamos al contenedor
    if (!chatContainer) return;

    const start = chatContainer.scrollTop; // altura inicial del contenedor (0)
    const end = chatContainer.scrollHeight - chatContainer.clientHeight; //altura total del contenedor - la altura de lo que el cliente ve
    const duration = 500; // Duración de la animación en ms
    let startTime = null;

    const smoothScroll = (timestamp) => {
      if (!startTime) startTime = timestamp; //Guarda tiempo inicial
      const elapsed = timestamp - startTime; //Cuanto tiempo ha pasado
      const progress = Math.min(elapsed / duration, 1);

      chatContainer.scrollTop = start + (end - start) * easeOutQuad(progress);

      if (progress < 1) {
        requestAnimationFrame(smoothScroll);
        //El tiempo que tarde en cargar la pagina, es el tiempo que se pasa a timestamp
      }
    };

    requestAnimationFrame(smoothScroll);
  }, [messages]);

  // Función de easing para hacer el desplazamiento más natural
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="profile pic" />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-40 ml-1">{tiempoFormato(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && <img src={message.image} alt="Imagen" className="sm:max-w-[200px] rounded-md mb-2" />}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
