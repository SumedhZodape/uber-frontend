import { useNavigate } from "react-router-dom"

export const Role = () => {

    const navigate = useNavigate()

    return (
        <div className="h-svh w-full bg-black text-white flex flex-col p-5 justify-center items-center relative">
            <div className="flex w-full flex-col items-center gap-6 mb-10">
                <h1 className="font-bold text-5xl">Uber</h1>
                <button className="w-full bg-white text-black p-2" onClick={()=>{
                    navigate('/user-registration')
                }}>Register As User</button>
                <button className="w-full bg-white text-black p-2" onClick={()=>{
                    navigate('/captain-registration')
                }}>Register As Captain</button>
            </div>
        </div>
    )
}
