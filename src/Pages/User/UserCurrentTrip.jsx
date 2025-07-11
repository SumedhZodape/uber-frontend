

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UserCurrentTrip() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useParams();

    console.log(location)
    const [isLogin, setIsLogin] = React.useState(false);
    const [currentRide, setCurrentRide] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [otp, setOtp] = useState([]);
    const [completedModal, setCompletedModal] = useState(false);


    // get current ride info
    const getCurrentRide = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/user/get-ride-info`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(res)

            if (res.data?.result) {
                const starL = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${res.data?.result?.startLocation?.coordinates[0]}&lon=${res?.data?.result?.startLocation?.coordinates[1]}&apiKey=e82755a4435446889f0f99a5a3f9c06f`)
                const endL = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${res.data?.result?.endLocation?.coordinates[0]}&lon=${res?.data?.result?.endLocation?.coordinates[1]}&apiKey=e82755a4435446889f0f99a5a3f9c06f`)
                setCurrentRide({
                    ...res.data?.result,
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
    const updateRideStatus = async (status) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/captain/update-ride-status/${currentRide?._id}`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(res)

            if (res.data) {
                toast.success(`${status}`)
                setCurrentRide({ ...currentRide, status })
                if(status === "Completed"){
                    setCompletedModal(true)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    console.log(currentRide)

    console.log(otp)

    const VerifyOtp = async() =>{
        if(otp.length !== 4){
            return toast.info("Pleas Enter OTP")
        }

        console.log(otp.join(""))


        try {
            const res = await axios.put(`http://localhost:8000/api/captain/otp-verification/${currentRide._id}`, 
                {otp:otp.join("")}, {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
            console.log(res.data)
            if(res.data.success){
                toast.success(res.data.message)
                setCurrentRide({ ...currentRide, status: "Ride Started" })
                setOtp([])
                setIsModalOpen(false)
            }else{
                toast.error("Invalid OTP")
            }
        } catch (error) {
            toast.error("Invalid OTP")
        }
    }

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
                <div className='w-full border border-gray-300 rounded-md
                    flex flex-col gap-2 p-3 items-center' >
                    <h2 className='text-3xl font-bold tracking-widest'>69876</h2>
                    <p className='text-gray-500 text-[12px]'>OTP</p>
                </div>
            </div>



            <div className='p-4'>
                <div className='w-full border border-gray-300 rounded-md
                    flex flex-col gap-2 p-3 items-center' >
                    <button className='w-full py-3 bg-gray-600 text-white
                rounded-md font-bold'>Emergency Support</button>
                    <p className='text-gray-500 text-[12px]'>Tap if you need immediate assistance</p>

                </div>
            </div>

            {
                isModalOpen ? (
                    <div className="modal p-4">
                        <div className='bg-white rounded-xl flex flex-col items-center gap-2 p-8 relative'>
                            <i className="fa-solid fa-circle-xmark text-red-500 text-3xl absolute
                    right-[-5px] top-[-5px]" onClick={() => {
                        setIsModalOpen(false);
                        setOtp([])
                    }}></i>
                            <h3 className='font-bold'>OTP</h3>
                            <div className='flex gap-2 w-full justify-center items-center'>
                                <input type='text' className='border border-gray-400 w-8 h-8
                        flex items-center justify-center p-2 font-bold'
                                    onChange={(e) => {
                                        setOtp([...otp, e.target.value])
                                    }} />
                                <input type='text' className='border border-gray-400 w-8 h-8
                        flex items-center justify-center p-2 font-bold'
                                    onChange={(e) => {
                                        setOtp([...otp, e.target.value])
                                    }} />
                                <input type='text' className='border border-gray-400 w-8 h-8
                        flex items-center justify-center p-2 font-bold'
                                    onChange={(e) => {
                                        setOtp([...otp, e.target.value])
                                    }} />
                                <input type='text' className='border border-gray-400 w-8 h-8
                        flex items-center justify-center p-2 font-bold'
                                    onChange={(e) => {
                                        setOtp([...otp, e.target.value])
                                    }} />
                            </div>
                            <button className='bg-black text-white p-2 rounded-md'
                            onClick={VerifyOtp}>Submit</button>
                        </div>
                    </div>
                ) : null
            }


            {
                completedModal ? (
                    <div className="modal p-4">
                        <div className='bg-white rounded-xl flex flex-col items-center gap-2 p-8 relative'>
                           
                            <h3 className='font-bold text-green-500 text-2xl'>Congratulation...</h3>
                            <p className='text-gray-500 text-center'>Your Ride Completed Successfully 
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            </p>
                           
                            <button className='bg-black text-white p-2 rounded-md'
                            onClick={()=>{
                                navigate("/captain-home")
                            }}>Go To Dashboard</button>
                        </div>
                    </div>
                ) : null
            }


        </>
    )
}
