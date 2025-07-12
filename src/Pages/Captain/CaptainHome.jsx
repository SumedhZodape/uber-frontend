import React, { useState, useEffect, } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getSockect } from '../../socket.js';

export default function CaptainHome() {

  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ rideId: null, startLocation: null, endLocation: null, distance: null, price: null })
  const [acceptedRideId, setAcceptedRideId] = useState(null)
  useEffect(() => {
    setTimeout(() => {
      // fetchRide()
    }, 5000);
  }, [])

  const fetchRide = async () => {

    const response = await axios.get('http://localhost:8000/api/captain/get-ride-info/686689e5ed5cd2baa3df5b4f', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    console.log(response)

    if (response?.data?.success) {
      const starL = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${response?.data?.result?.startLocation?.coordinates[0]}&lon=${response?.data?.result?.startLocation?.coordinates[1]}&apiKey=e82755a4435446889f0f99a5a3f9c06f`)

      console.log(starL?.data)

      const endL = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${response?.data?.result?.endLocation?.coordinates[0]}&lon=${response?.data?.result?.endLocation?.coordinates[1]}&apiKey=e82755a4435446889f0f99a5a3f9c06f`)
      console.log(endL?.data)

      if (starL && endL) {
        setModalData({
          rideId: response?.data?.result?._id,
          startLocation: `${starL?.data?.features[0]?.properties?.address_line1}, 
          ${starL?.data?.features[0]?.properties?.city}`,
          endLocation: `${endL?.data?.features[0]?.properties?.address_line1}, 
          ${endL?.data?.features[0]?.properties?.city}`,
          distance: response?.data?.result?.distance,
          price: response?.data?.result?.price
        })
      }
      setShowModal(true)
    }
  }

  const acceptRide = async (rideId) => {

    const response = await axios.put(`http://localhost:8000/api/captain/approved-request/${rideId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    console.log(response.data)

    if (response?.data?.success) {
      toast.success(response?.data?.message);
      navigate(`/current-trip/${rideId}`)
    }
  }

  
    // get current ride info
    const getCurrentRide = async() =>{
      try {
        const res = await axios.get("http://localhost:8000/api/captain/get-accepted-ride/Accepted", {
          headers:{
            Authorization:`Bearer ${token}`
          }
        });

        if(res.data?.result){
          setAcceptedRideId(res.data?.result[0]._id)
        }
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
  
    useEffect(()=>{
      getCurrentRide()
    },[])
  

    useEffect(()=>{
      const socket = getSockect();

      if(socket){
        socket.on('rideRequest', (data)=>{
          console.log(data);
          alert("New Ride Request...")
        })
      }

    },[])

  return (
    <>
      <div className='p-4 flex justify-between bg-black'>

        <div className='logo text-white text-2xl font-bold '>
          Uber
        </div>

        <div className='user-panel flex flex-col items-end gap-2 relative'>
          <div className='bg-white text-black font-bold h-10 w-10 flex justify-center items-center rounded-full'
            onClick={() => { setIsLogin(!isLogin) }}>A</div>

          {
            isLogin ? (
              <div className='border absolute bottom-[-40px] bg-white border-gray-300 pt-1 pb-1 px-3 py-3' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                Logout
              </div>
            ) : null
          }
        </div>
      </div>

      <div className='p-4'>
        <div className='w-full border-3 border-dashed border-gray-400 p-3
        flex flex-col justify-center items-center gap-3'>
          <div className='h-15 w-15 bg-gray-200 rounded-full flex
          justify-center items-center'>
            <div className='bg-green-400 h-9 w-9 rounded-full'></div>
          </div>

          <h3 className='font-semibold'>You're Online</h3>
          <p className='text-gray-400 text-sm'>Ready to accept rides</p>
          <button className='p-2 bg-black text-white w-full rounded-xl'>Go Offline</button>

        </div>
      </div>

      <div className='p-4'>
        <div className='flex justify-between'>
          <div className='flex flex-col justify-center items-center border border-gray-300
          p-4 rounded-xl'>
            <h1 className='font-bold text-2xl'>$127.50</h1>
            <p className='text-gray-500 text-sm'>Today's Earnings</p>
          </div>
          <div className='flex flex-col justify-center items-center border border-gray-300
            p-4 rounded-xl'>
            <h1 className='font-bold text-2xl'>8</h1>
            <p className='text-gray-500 text-sm'>Trips Completed</p>
          </div>
        </div>

      </div>

      <div className='p-4'>
        <div className='w-full border border-gray-300 rounded-md
        flex gap-5 p-3 items-center'>
          <div className='flex justify-center items-center h-9 w-9
          rounded-full bg-gray-300'>
            <i className="fa-regular fa-star text-xl"></i>
          </div>
          <div className='flex flex-col'>
            <h2 className='font-semibold'>View Stats</h2>
            <p className='text-gray-500 text-sm'>Earning & Performance</p>
          </div>
        </div>

        <div className='w-full border border-gray-300 rounded-md
        flex gap-5 p-3 items-center' >
          <div className='flex justify-center items-center h-9 w-9
          rounded-full bg-gray-300'>
            <i className="fa-solid fa-location-dot text-xl"></i>
          </div>
          <div className='flex flex-col'>
            <h2 className='font-semibold' 
            onClick={()=>{
              navigate(`/current-trip/${acceptedRideId}`)
            }}>Active Booking</h2>
            <p className='text-gray-500 text-sm'>Manage current trip</p>
          </div>
        </div>

      </div>


      {
        showModal ? (
          <div className='w-full h-svh bg-[rgba(0,0,0,0.5)] fixed z-30
     top-0 left-0 flex justify-center items-center'>
            <div className='w-[80%] p-4 bg-white rounded-2xl flex flex-col
        items-center'>
              <h2 className='mb-2 font-bold'>New Ride...</h2>
              <div className='w-full border border-gray-300 rounded-md
                    flex flex-col gap-5 p-5 items-start justify-center' >
                <h1 className='text-black font-bold'>Trip Details</h1>

                <div className='w-full rounded-md
                         flex gap-5' >
                  <div className='flex justify-center items-center h-9 w-9
                            rounded-full bg-gray-300'>
                    <i className="fa-solid fa-circle-dot text-xl"></i>
                  </div>
                  <div className='flex flex-col gap-0'>
                    <h4 className='font-semibold'>Pickup</h4>
                    <p className='text-gray-700 text-[14px]'>{modalData?.startLocation}</p>
                    <p className='text-gray-600 text-[12px]'>2 min away • 0.5 km</p>
                  </div>
                </div>

                <div className='h-2 ms-4 border-gray-400 border-l-2 border-dashed '>

                </div>



                <div className='w-full rounded-md
                         flex gap-5' >
                  <div className='flex justify-center items-center h-9 w-9
                            rounded-full bg-gray-300'>
                    <i className="fa-solid fa-location-dot text-xl"></i>
                  </div>
                  <div className='flex flex-col gap-0'>
                    <h4 className='font-semibold'>Destination</h4>
                    <p className='text-gray-700 text-[14px]'>{modalData?.endLocation}</p>
                    <p className='text-gray-600 text-[12px]'>15 min drive • 8.2 km</p>
                  </div>
                </div>
                <div>
                  <p className='text-gray-600 text-[12px]'>Distance: {modalData.distance}km</p>
                  <p className='text-gray-600 text-[12px]'>Fare: ₹{modalData.price}</p>
                </div>
              </div>
              <div className='flex justify-between w-full mt-3'>
                <button className='w-1/3 py-3 bg-red-600 text-white
                rounded-md font-semibold text-[15px]'
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button className='w-1/3 py-3 bg-green-600 text-white
                rounded-md font-semibold text-[15px]'
                  onClick={() => {
                    acceptRide(modalData.rideId)
                  }}>Accept</button>
              </div>
            </div>
          </div>
        ) : null
      }


    </>
  )
}
