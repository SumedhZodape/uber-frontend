import { useForm } from 'react-hook-form';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function CaptainLogin() {

  const { 
    register,
    handleSubmit,
    formState:{errors},
    reset
  } = useForm()

  const navigate = useNavigate();


  const onSubmit = async (data) =>{
    
    let payload = data;

    try {
      const res = await axios.post("http://localhost:8000/api/captain/login", payload);
      console.log(res)
      const response = res.data;
      if(response){
        if(response.success === true){
          toast.success(response.message);
          localStorage.setItem('token', response.token)
          reset({})
          navigate('/captain-home')
        }else{
          toast.error(response.message)
        }
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  return (
    <div className="h-svh bg-white text-black flex flex-col items-center justify-center p-5 relative">
      <h2 className="font-bold text-gray-600 text-2xl mb-4">Captain Login</h2>
      <form className="flex flex-col gap-6 mb-10" onSubmit={handleSubmit(onSubmit)}>
        
        
        
        <input type="email" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0" 
        placeholder="Enter Email" {...register('email')} />

        <input type="password" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
        placeholder="Enter Password" {...register('password')} />

        <button className="w-full bg-black text-white p-2">Login</button>
      </form>
    </div>
  )
}
