import React, {useState} from 'react'

export default function CaptainHome() {

  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
    <div className='p-4 flex justify-between bg-black'>

      <div className='logo text-white text-2xl font-bold '>
        Uber
      </div>

      <div className='user-panel flex flex-col items-end gap-2 relative'>
        <div className='bg-white text-black font-bold h-10 w-10 flex justify-center items-center rounded-full'
        onClick={()=>{setIsLogin(!isLogin)}}>A</div>

        {
          isLogin ? (
            <div className='border absolute bottom-[-40px] bg-white border-gray-300 pt-1 pb-1 px-3 py-3' style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
              Logout
            </div>
          ):null
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
    </>
  )
}
