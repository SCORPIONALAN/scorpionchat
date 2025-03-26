import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import {MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader2} from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName:"",
    email:"",
    password:"",
  });
  const {signup, isSigningUp} = useAuthStore();
  const validateForm = () =>{
    if(!formData.fullName.trim()){
      return toast.error("El nombre es requerido")
    }
    if(!formData.email){
      return toast.error("El email es requerido")
    }
    if(!formData.password){
      return toast.error("Se necesita de una password")
    }
    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)){
      return toast.error("Correo invalido")
    }
    if(formData.password < 6)
      return toast.error("La password debe contener al menos 6 caracteres")
    return true;
  }
  const handleSubmit = (e) =>{
    e.preventDefault();
    const successStatus = validateForm();
    if(successStatus === true) signup(formData);
  }
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors z-40'>
                <MessageSquare className='size-6 text-primary'/>
              </div>
              <h1 className='text-2xl font-bold mt-2'>Crea una cuenta!</h1>
              <p className='text-base-content/60'> Inicia con tu cuenta gratuita!</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='labal-text font-medium'>Nombre y apellido</span>
              </label>
              <div className="relative">
                <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none z-40'>
                  <User className="size-5 text-base-content/40"/>
                </div>
                <input
                  type='text'
                  className={`input input-bordered w-full pl-10`}
                  placeholder='Alan Torres'
                  value={formData.fullName}
                  onChange={(e)=> setFormData({...formData, fullName:e.target.value})}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='labal-text font-medium'>Email</span>
              </label>
              <div className="relative">
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-40'>
                  <Mail className="size-5 text-base-content/40"/>
                </div>
                <input
                  type='email'
                  className={`input input-bordered w-full pl-10`}
                  placeholder='ejemplo1@ejemplo.com'
                  value={formData.email}
                  onChange={(e)=> setFormData({...formData, email:e.target.value})}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='labal-text font-medium'>Password</span>
              </label>
              <div className="relative">
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-40'>
                  <Lock className="size-5 text-base-content/40"/>
                </div>
                <input
                  type={showPassword? "text": "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder='**********'
                  value={formData.password}
                  onChange={(e)=> setFormData({...formData, password:e.target.value})}
                />
                <button
                type="button"
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={()=>setShowPassword(!showPassword)}
                >{
                  showPassword?(<EyeOff className='size-5 text-base-content/40'/>):(<Eye className='size-5 text-base-content/40 z-40'/>)
                }</button>
              </div>
            </div>

            <button type='submit' className='btn btn-primary w-full' disabled={isSigningUp}>
              {isSigningUp?(
                <>
                <Loader2 className='size-5 animate-spin'/>
                Loading...
                </>
              ):(
                "Create Account"
              )}
            </button>
          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>
            Ya tienes una cuenta?{" "}
            <Link to="/login" className='link link-primary'>
            Inicia sesion!
            </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Lado derecho de la APP */}
      <AuthImagePattern
      title="Unete a nuestra comunidad"
      subtitle="Comparte maravillosos momentos con amigos"/>
    </div>
  )
}

export default SignUpPage
