import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function UserRegistration() {

  const [location, setLocation] = useState({lat:null, lng:null})

  const navigate = useNavigate();

  const { 
    register,
    handleSubmit,
    formState:{errors},
    reset
  } = useForm()

  useEffect(()=>{

    navigator.geolocation.getCurrentPosition((position)=>{
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      setLocation({lat, lng})
    })

  }, [])

  const onSubmit = async (data) =>{
    
    let payload = data;
    payload.location = {type: "Point", coordinates: [ location.lat, location.lng ]}
    console.log(payload)

    try {
      const res = await axios.post("http://localhost:8000/api/user/register", payload);
      console.log(res)
      const response = res.data;
      if(response){
        if(response.success === true){
          toast.success(response.message);
          reset({})
          navigate('/user-login')
        }else{
          toast.error(response.message)
        }
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  return (
    <div className="h-svh bg-white text-black flex flex-col p-5 relative">
      <h2 className="font-bold text-gray-600 text-2xl mb-4">User Registration</h2>
      <form className="flex flex-col gap-6 mb-10" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
         placeholder="Enter Name" {...register('name')} />
        <input type="date" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
         placeholder="Enter DOB" {...register('dob')}  />
        <input type="tel" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0" 
        placeholder="Enter Mobile No." {...register('mobileNo')} />
        <input type="email" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0" 
        placeholder="Enter Email" {...register('email')} />
        <input type="password" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
        placeholder="Enter Password" {...register('password')} />
        <button className="w-full bg-black text-white p-2">Continue</button>
        <Link to="/user-login">
          <p className="text-blue-500 text-center mb-5">Login?</p>
        </Link>
      </form>
    </div>
  )
}
