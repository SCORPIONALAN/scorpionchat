import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { FileInput, Image, Send, X } from 'lucide-react';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagenPrevia, setImagenPrevia] = useState(null);
    const entradaArchivo = useRef(null);        //QuerySelector de react
    const{sendMessage} = useChatStore();

    const handleImageSelect = (e) =>{
        const file = e.target.files[0] //Consigueme el primer archivo
        if(!file.type.startsWith("image/")){
            toast.error('favor de seleccionar una imagen');
            return;
        }
        const filereader = new FileReader();
        filereader.onloadend = () =>{
            setImagenPrevia(filereader.result);
        };
        filereader.readAsDataURL(file);
    };
    const removeImage = () =>{
        setImagenPrevia(null);
        if (entradaArchivo.current) entradaArchivo.current.value = '';
    };
    const handleSendMessage = async(e) => {
        e.preventDefault();
        if(!text.trim() && !imagenPrevia) return; // Si el usuario no manda nada, entonces no hagas nada
        try {
            await sendMessage({
                text: text.trim(),
                image: imagenPrevia
            });
            // Limpiar formulario
            setText('');
            setImagenPrevia(null);
            if(entradaArchivo.current) entradaArchivo.current.value=''; 
        } catch (error) {
            console.error('error al mandar el mensaje: ', error);
        }
    };
  return (
    <div className='p-4 w-full'>
        {/*     Conditional Rendering para mostrar una imagen previa */}
      {imagenPrevia && (
        <div className='mb-3 flex items-center gap-2'>
            <div className='relative'>
                <img
                    src = {imagenPrevia}
                    alt = 'Imagen previa'
                    className=' size-20 object-cover rounded-lg border-zinc-600'
                />
                <button
                onClick={removeImage}
                className='absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center'
                type='button'
                >
                    <X className='size-3'/>
                </button>
            </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        {/*         ZONA MODIFICABLE             */}
        <div className='flex-1 flex gap-2'>
            {/*         ZONA DE ESCRITURA        */}
            <input
            type='text'
            className='w-full input input-bordered rounded-lg input-sm sm:input-md'
            placeholder='Escribe un mensaje...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
            {/*     ZONA DE SUBIR ARCHIVOS       */}
            <input
                type='file'
                accept='image/*'
                className='hidden'
                ref={entradaArchivo}
                onChange={handleImageSelect}
            />
            <button
                type='button'
                className={`hidden sm:flex btn btn-circle ${imagenPrevia? 'text-emerald-500': 'text-zinc-400'}`}
                onClick={() => entradaArchivo.current?.click()}
            >
                <Image size={20}/>
            </button>
        </div>
        {/*         SUBMIT           */}
        <button
            type='submit'
            className='btn btn-sm btn-circle'
            disabled={!text.trim() && !imagenPrevia}
        >
            <Send size={22}/>
        </button>
      </form>
    </div>
  )
}

export default MessageInput
