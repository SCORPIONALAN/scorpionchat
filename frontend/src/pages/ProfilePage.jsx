import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {Camera, Mail, User} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const handelImageUpload = async (e)=>{
    e.preventDefault();
    //agarrar el archivo que el usuario subio
    const file= e.target.files[0];
    if(!file) return toast.error("Tienes que escoger algo");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async ()=>{
      //Convertor del formato 64
      const base64Image = reader.result;
      setSelectedImg(base64Image)
      await updateProfile({profilePic: base64Image})
    }

  }

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Perfil</h1>
            <p className='mt-2'>Informacion de tu perfil</p>
          </div>
          {/*     ZONA PARA EDITAR EL AVATAR          */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img
                src={selectedImg ||authUser.profilePic || '/avatar.png'}
                alt='profile'
                className='size-32 rounded-full object-cover border-4'
              />
              <label
              htmlFor='avatar-upload'
              className={`
                absolute top-20 right-0 bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer transition-all duration-200
                ${isUpdatingProfile? "animate-pulse pointer-events-none": ""}
                `}
              >
                <Camera className='size-5 text-base-200'/>
                <input
                type= 'file'
                id='avatar-upload'
                className='hidden'
                accept='image/*'
                onChange= {handelImageUpload}
                disabled = {isUpdatingProfile}
                />
              </label>
            </div>
            <p className='text-sm text-zinc-400 mt-10'>
              {isUpdatingProfile? "Uploading...":"Click en la camara para cambiar tu foto"}
            </p>
          </div>
          <div className='space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <User className='w-4 h-4'/>
                Nombre y apellido
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.fullName}</p>
            </div>
            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <Mail className='w-4 h-4'/>
                Correo electronico
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.email}</p>
            </div>
          </div>
          <div className='mt-6 bg-base-300 rounded-xl p-6'>
            <h2 className='text-lg font-medium mb-4'>Informacion de la cuenta</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                <span>Miembro desde</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span>Estatus de la cuenta</span>
                <span className='text-green-500'>Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
