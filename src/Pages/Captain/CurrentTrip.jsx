import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CurrentTrip() {
    const token = localStorage.getItem('token')
    const location = useParams()
    const [isLogin, setIsLogin] = React.useState(false);
    const [currentRide, setCurrentRide] = useState({})


    // get current ride info
    const getCurrentRide = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/captain/get-accepted-ride/Accepted`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data?.result) {
                const starL = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${res.data?.result[0]?.startLocation?.coordinates[0]}&lon=${res?.data?.result[0]?.startLocation?.coordinates[1]}&apiKey=e82755a4435446889f0f99a5a3f9c06f`)
                const endL = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${res.data?.result[0]?.endLocation?.coordinates[0]}&lon=${res?.data?.result[0]?.endLocation?.coordinates[1]}&apiKey=e82755a4435446889f0f99a5a3f9c06f`)
                setCurrentRide({
                    ...res.data?.result[0],
                    startLocation: `${starL?.data?.features[0]?.properties?.address_line1}, 
                ${starL?.data?.features[0]?.properties?.city}`,
                    endLocation: `${endL?.data?.features[0]?.properties?.address_line1}, 
                ${endL?.data?.features[0]?.properties?.city}`
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCurrentRide()
    }, [])


    // change ride status 
    const updateRideStatus = async(status)=>{
        try {
            const res = await axios.put(`http://localhost:8000/api/captain/update-ride-status/${currentRide?._id}`, {status}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(res)

            if(res.data){
                toast.success(`${status}`)
                setCurrentRide({...currentRide, status})
            }
        } catch (error) {
            console.log(error)
        }
    }

    console.log(currentRide)

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
                <div className='w-full border border-gray-300 rounded-md
        flex flex-col gap-5 p-3 items-center justify-center' >
                    <div className='text-white text-xs bg-black py-1 px-4 rounded-2xl'>{currentRide?.status}</div>
                    <div className='w-full flex flex-col gap-3'>
                        <div className='w-full h-4 bg-gray-200 rounded-xl overflow-hidden'>
                            <div className={`h-4 w-[${
                                currentRide?.status === "Accepted" ? '25%' :
                                currentRide?.status === "Arrived" ? '50%' :
                                currentRide?.status === "Ride Started" ? '75%' : '100%'
                                }] bg-green-500`}></div>
                        </div>
                        <div className='flex justify-between'>
                            <p className='text-gray-500 text-sm'>Accepted</p>
                            <p className='text-gray-500 text-sm'>Arrived</p>
                            <p className='text-gray-500 text-sm'>Started</p>
                            <p className='text-gray-500 text-sm'>Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-4'>
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
                            <p className='text-gray-700 text-[14px]'>{currentRide?.startLocation}</p>
                            <p className='text-gray-600 text-[12px]'>2 min away • 0.5 km</p>
                        </div>
                    </div>

                    <div className='h-8 ms-4 border-gray-400 border-l-2 border-dashed '>

                    </div>

                    <div className='w-full rounded-md
                         flex gap-5' >
                        <div className='flex justify-center items-center h-9 w-9
                            rounded-full bg-gray-300'>
                            <i className="fa-solid fa-location-dot text-xl"></i>
                        </div>
                        <div className='flex flex-col gap-0'>
                            <h4 className='font-semibold'>Destination</h4>
                            <p className='text-gray-700 text-[14px]'>{currentRide?.endLocation}</p>
                            <p className='text-gray-600 text-[12px]'>{(currentRide?.distance * 5).toFixed(0)} min drive • {currentRide?.distance} km</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-4'>
                <div className='w-full border border-gray-300 rounded-md
                    flex gap-5 p-3 items-center' >
                    <div className='flex justify-center items-center h-12 w-12
                        rounded-full bg-gray-200'>
                        <i className="fa-regular fa-user text-xl" ></i>
                    </div>
                    <div className='flex flex-col'>
                        <h3 className='font-semibold text-[16px] text-gray-800'>{currentRide?.userId?.name}</h3>
                        <p className='text-gray-500 text-sm'><i className="fa-regular fa-star"></i> 4.8 rating</p>
                    </div>

                </div>
            </div>

            <div className='p-4'>
                <div className='flex justify-between'>
                    <div className='w-[30%] flex flex-col justify-center items-center border border-gray-300
          py-3 px-1 rounded-xl'>
                        <h1 className='font-bold text-xl'>₹{currentRide?.price}</h1>
                        <p className='text-gray-500 text-[12px]'>Fare</p>
                    </div>
                    <div className='w-[30%] flex flex-col justify-center items-center border border-gray-300
            py-3 px-1 rounded-xl'>
                        <h1 className='font-bold text-xl'>{(currentRide?.distance * 5).toFixed(0)}</h1>
                        <p className='text-gray-500 text-[12px]'>ETA (min)</p>
                    </div>
                    <div className='w-[30%] flex flex-col justify-center items-center border border-gray-300
            py-3 px-1 rounded-xl'>
                        <h1 className='font-bold text-xl'>{currentRide?.distance}</h1>
                        <p className='text-gray-500 text-[12px]'>Distance (km)</p>
                    </div>
                </div>

            </div>


            <div className='p-4'>
                <button className='w-full py-3 bg-black text-white
                rounded-md font-bold'
                onClick={()=>{
                    updateRideStatus(
                        currentRide.status === "Accepted" ? "Arrived" : 
                        currentRide.status === "Arrived" ? "Ride Started" : "Completed"
                    )
                }}
                >{
                    currentRide?.status === "Accepted" ? "Arrived at Pickup":
                    currentRide?.status === "Arrived" ? "Ride Started": "Completed"

                }</button>
                <button className='w-full py-2 mt-3 bg-white text-gray-600
                rounded-md border text-[14px] font-semibold border-gray-400 '><i className="fa-solid fa-location-dot mr-2"></i>Open in Maps</button>
            </div>


            <div className='p-4'>
                <div className='w-full border border-gray-300 rounded-md
                    flex flex-col gap-2 p-3 items-center' >
                    <button className='w-full py-3 bg-gray-600 text-white
                rounded-md font-bold'>Emergency Support</button>
                    <p className='text-gray-500 text-[12px]'>Tap if you need immediate assistance</p>

                </div>
            </div>

        </>
    )
}
