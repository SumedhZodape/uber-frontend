import axios from "axios";
import {  useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";


const UserHome = () => {

  // submit button logic
  const [locked, setLocked] = useState({ inp1: false, inp2: false });
  const [startLocations, setStartLocations] = useState([]);
  const [endLocation, setEndLocation] = useState([])
  const [selectedStartLocation, setSelectedStartLocation] = useState(null);
  const [selectedEndLocation, setSelectedEndLocation] = useState(null);
  const [selectedStartLocationText, setSelectedStartLocationText] = useState(null)
  const [selectedEndLocationText, setSelectedEndLocationText] = useState(null)
  const [prices, setPrices] = useState({car:0, auto:0, bike: 0})
  const [activeVehicle, setActiveVehicle] = useState({car:false, auto:false, bike: false})

  const inp = useRef();


  const getLocations = async(userInp, locationType) =>{

    if(userInp.trim() === "" || userInp.trim().length <= 3){
      setStartLocations([])
      setEndLocation([])

      if(locationType === 'startLocation' ){
        setSelectedStartLocation(null)
      }else{
        setSelectedEndLocation(null)
      }
      return 
    }
    const url =  `https://api.geoapify.com/v1/geocode/autocomplete?text=${userInp}&
    filter=rect:78.9,21.0,79.3,21.3&limit=10&apiKey=e82755a4435446889f0f99a5a3f9c06f`
    try{
      const locationResponse = await axios.get(url)

      if(locationType === 'startLocation'){
        setStartLocations(locationResponse.data.features)
      }else{
        setEndLocation(locationResponse.data.features)
      }
    }catch(err){
      console.log(err)
    }
  }

  const setAnyLocation = ()=>{
    setStartLocations([])
    setEndLocation([])
  }


  const changePosition = () =>{
    console.log(inp)

    inp.current.style.top = "0"
    inp.current.style.transition = ".2s"
  }




  // fare calculation
  const calculateDistance = (coord1, coord2) =>{
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return parseFloat(distance.toFixed(2))
}

  useEffect(()=>{

    if(selectedStartLocation && selectedEndLocation){
      const distance = calculateDistance(
              selectedStartLocation?.geometry.coordinates,
              selectedEndLocation?.geometry.coordinates
      );
      console.log(distance)

      const carPrice = (distance * 15).toFixed(2);
      const autoPrice = (distance * 10).toFixed(2);
      const bikePrice = (distance * 5).toFixed(2);

      setPrices({car: carPrice, auto:autoPrice, bike:bikePrice})
    }

  }, [selectedStartLocation, selectedEndLocation])



  /// book cab api integratin
  const BookCab = async() =>{

      if(!selectedStartLocation || !selectedEndLocation){
        return toast.error('All Fields are mandetory!')
      }
      console.log(selectedStartLocation)

      if(activeVehicle.car || activeVehicle.bike || activeVehicle.auto){

        const payload = {
          "vehicleType":activeVehicle.car ? 'Car': activeVehicle.auto ? 'Auto':'TwoWheeler',
          "startLocation":{"type": "Point", "coordinates": [selectedStartLocation.geometry.coordinates[1], selectedStartLocation.geometry.coordinates[0]]},
          "endLocation":{"type": "Point", "coordinates": [selectedEndLocation.geometry.coordinates[1], selectedEndLocation.geometry.coordinates[0]]}
        }

        console.log(payload)

        try {

          const token = localStorage.getItem('token')
          
          const response = await axios.post('http://localhost:8000/api/user/book-cab', payload , {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if(!response.data.success){
            return toast.info(response.data.message)
          }
          console.log(response.data)

        } catch (error) {
          toast.error('Something went wrong!')
        }


      }else{
        toast.error('Please Select the Vehicle')
      }

  }
  
  return (

    <>
    <div className="relative">
      <div className="w-full p-3 flex items-center justify-center">
          <img src="https://maps.olakrutrim.com/images/features/routing.svg" alt="" />
      </div>
      <div className="w-full md:w-[40%] mx-auto h-svh text-black font-sans p-2 absolute bg-white" ref={inp}>
        <div className="w-full text-center">
          <h1 className="text-center font-bold text-xl font-sans">Where to?</h1>
          <p>Choose your pick and drop location</p>
        </div>

        <form className="w-full flex flex-col gap-3 mt-6">
          <div className="w-full mt-4 flex items-center border-1 border-black rounded-xl relative">
            <input
              value={selectedStartLocationText}
              type="search"
              className="outline-0 p-2 w-full"
              placeholder="Pickup Location"
              onChange={(e)=>{
                getLocations(e.target.value, 'startLocation');
                setSelectedStartLocationText(e.target.value)
              }}
              onClick={changePosition}
            />
          </div>
          <div className="flex flex-col gap-2">
              {

                startLocations.map((location)=>{
                  return (
                    <div key={location.address_line1} className="flex items-center gap-3 cursor-pointer bg-gray-100 p-2 rounded-2xl"
                    onClick={()=>{
                      setSelectedStartLocation(location)
                      setAnyLocation()
                      setSelectedStartLocationText(location?.properties?.address_line1 +  ", "+ location?.properties?.city)
                    }}>
                      <i className="fa-solid fa-location-dot text-1xl"></i>
                      {location?.properties?.address_line1 +  ", "+ location?.properties?.city}
                    </div>
                  )
                })
              }
              
          </div>

          <div className="w-full mt-2 flex items-center border-1 border-black rounded-xl relative">
            <input
              value={selectedEndLocationText}
              type="search"
              className="outline-0 p-2 w-full"
              placeholder="End Location"
              onChange={(e)=>{
                getLocations(e.target.value, 'endLocation');
                setSelectedEndLocationText(e.target.value)
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
              {

                endLocation.map((location)=>{
                  return (
                    <div key={location.address_line1} className="flex items-center gap-3 cursor-pointer bg-gray-100 p-2 rounded-2xl"
                    onClick={()=>{
                      setSelectedEndLocation(location)
                      setAnyLocation()
                      setSelectedEndLocationText(location?.properties?.address_line1 +  ", "+ location?.properties?.city)
                    }}>
                      <i className="fa-solid fa-location-dot text-1xl"></i>
                      {location?.properties?.address_line1 +  ", "+ location?.properties?.city}
                    </div>
                  )
                })
              }
              
          </div>
        </form>


         {
          selectedStartLocation && selectedEndLocation ? (
            <div className="w-full p-2 flex flex-col gap-3">
                  <div className="flex border border-gray-300 gap-4 rounded-2xl p-2 items-center overflow-hidden"
                  style={activeVehicle.bike ? {border:'2px solid #000000'}:null}
                  onClick={()=>{
                    setActiveVehicle({car:false, auto:false, bike:true})
                  }}>
                    <div className="flex flex-col w-1/3 items-center">
                      <div className="h-12">
                        <img src="https://imgd.aeplcdn.com/370x208/n/cw/ec/155297/s1-air-right-front-three-quarter-8.png?isig=0&q=80"  className="h-full" alt="" />
                      </div>
                      <p className="text-sm mt-1 text-gray-900">1 min</p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                    <div>
                      <h2 className="text-black font-bold">Bike</h2>
                      <p className="text-gray-400 text-sm">2 min away</p>
                    </div>
                    <div>
                      <h2 className="text-black font-bold">₹{prices.bike}</h2>
                      <p className="text-gray-400"><strike>₹{Number(prices.bike) + 29}</strike></p>
                    </div>
                    </div>
                  </div>

                  <div className="flex border border-gray-300 gap-4 rounded-2xl p-2 items-center overflow-hidden"
                  onClick={()=>{
                    setActiveVehicle({car:false, auto:true, bike:false})
                  }}
                  style={activeVehicle.auto ? {border:'2px solid #000000'}:null}
                  >
                    <div className="flex flex-col w-1/3 items-center">
                      <div className="h-12">
                        <img src="https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png"  className="h-full" alt="" />
                      </div>
                      <p className="text-sm mt-1 text-gray-900">1 min</p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                    <div>
                      <h2 className="text-black font-bold">Auto</h2>
                      <p className="text-gray-400 text-sm">3 min away</p>
                    </div>
                    <div>
                      <h2 className="text-black font-bold">₹{prices.auto}</h2>
                      <p className="text-gray-400"><strike>₹{Number(prices.auto) + 39}</strike></p>
                    </div>
                    </div>
                  </div>


                  <div className="flex border border-gray-300 gap-4 rounded-2xl p-2 items-center overflow-hidden"
                  onClick={()=>{
                    setActiveVehicle({car:true, auto:false, bike:false})
                  }}
                  style={activeVehicle.car ? {border:'2px solid #000000'}:null}
                  >
                    <div className="flex flex-col w-1/3 items-center">
                      <div className="h-12">
                        <img src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png"  className="h-full" alt="" />
                      </div>
                      <p className="text-sm mt-1 text-gray-900">1 min</p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                    <div>
                      <h2 className="text-black font-bold">Prime Plus</h2>
                      <p className="text-gray-400 text-sm">Ride in utmost comfort</p>
                    </div>
                    <div>
                      <h2 className="text-black font-bold">₹{prices.car}</h2>
                      <p className="text-gray-400"><strike>₹{Number(prices.car) + 49}</strike></p>
                    </div>
                    </div>
                  </div>
            </div>
          ):null
         }     
      

        <button
          disabled={!activeVehicle.car && !activeVehicle.bike && !activeVehicle.auto}
          className="w-full bg-black text-white p-3 mt-2 mb-3 rounded-2xl"
          onClick={BookCab}
        >
          Find Ride
        </button>
      </div>
    </div>
    </>
  );
};

export default UserHome;
