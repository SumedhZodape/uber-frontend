import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function CaptainRegistration() {

  const [location, setLocation] = useState({ lat: null, lng: null });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  useEffect(() => {

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      setLocation({ lat, lng })
    })

  }, [])

  const onSubmit = async (data) => {

    let payload = data;
    payload.location = { type: "Point", coordinates: [location.lat, location.lng] }
    console.log(payload)

    const formdata = new FormData();

    formdata.append('name', payload.name)
    formdata.append('email', payload.email)
    formdata.append('mobileno', payload.mobileno)
    formdata.append('dob', payload.dob)
    formdata.append('location', JSON.stringify(payload.location))
    formdata.append('address', payload.address)
    formdata.append('profilePic', payload.profilePic[0])
    formdata.append('vehicleType', payload.vehicleType)
    formdata.append('vehiclePic', payload.vehiclePic[0])
    formdata.append('vehicleNo', payload.vehicleNo)
    formdata.append('drivingLicenceNo', payload.drivingLicenceNo)
    formdata.append('password', payload.password)

    const res = await axios.post("http://localhost:8000/api/captain/register", formdata, {
      headers: {
        "Content-Type":"multipart/form-data"
      }
    });


    if(res.data.success){
      toast.success(res.data.message)
      navigate('/captain-login')
    }
    console.log(res)
  }

  return (
    <div className="h-svh bg-white text-black flex flex-col p-5 relative">
      <h2 className="font-bold text-gray-600 text-2xl mb-4">Captain Registration</h2>
      <form className="flex flex-col gap-6 mb-10" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
          placeholder="Enter Name" {...register('name')} />

        <input type="date" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
          placeholder="Enter DOB" {...register('dob')} />

        <input type="tel" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
          placeholder="Enter Mobile No." {...register('mobileno')} />

        <input type="email" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
          placeholder="Enter Email" {...register('email')} />

        <input type="text" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
          placeholder="Enter Address" {...register('address')} />

        <select className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
        {...register('vehicleType')}>
          <option value="">Select Vehicle Type</option>
          <option value="Car">Car</option>
          <option value="Auto">Auto</option>
          <option value="TwoWheeler">Two-Wheeler</option>
        </select>

        <input type="text" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
          placeholder="Enter Vehicle No" {...register('vehicleNo')} />

        <input type="text" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
          placeholder="Enter Driving Licence No" {...register('drivingLicenceNo')} />

        <div>
          <p className="mb-2 pb-0 text-gray-700">Profile Pic</p>
          <input type="file" className="w-[90%] box-border mt-0 border-1 mb-1 border-gray-300 rounded p-2 outline-0"
             {...register('profilePic')} />
        </div>

        <div >
          <p className="mb-2 pb-0 text-gray-700">Vehicle Pic:</p>
          <input type="file" className="w-[90%] mt-0 box-border border-1 mb-1 border-gray-300 rounded p-2 outline-0"
             {...register('vehiclePic')} />
        </div>

        <input type="password" className="border-1 mb-1 border-gray-300 rounded p-2 outline-0"
          placeholder="Enter Password" {...register('password')} />

        <button className="w-full bg-black text-white p-2">Continue</button>
        <Link to="/captain-login">
          <p className="text-blue-500 text-center mb-5">Login?</p>
        </Link>
      </form>
    </div>
  )
}
