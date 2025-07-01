import { useNavigate } from "react-router-dom"
export default function Startpage() {

  const navigate = useNavigate()  

  return (
    <>
        <div className="h-svh bg-black text-white flex flex-col p-5 justify-center items-center relative">
            <div className="flex flex-col items-center gap-6 mb-10">
                <h1 className="font-bold text-5xl">Uber</h1>
                <p className="text-gray-300">Go anywhere with Uber</p>
            </div>
            <div className="absolute bottom-0 p-5 flex flex-col gap-3">
                <button className="w-full bg-white text-black p-2" onClick={()=>{
                    navigate("/role")
                }}>Get Started</button>
                <p className="text-center text-gray-400">By proceeding, you consent to get calls, WhatsApp or SMS 
                    messages
                </p>
            </div>
        </div>
    </>
  )
}
