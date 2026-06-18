import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import CarMap from '../components/CarMap'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "../components/Calendar.css"

const CarDetails = () => {
  const [bookedDates,setBookedDates]=useState([])
  const [returned,setReturned] = useState(null)
  const [pickup,setPickup] = useState(null)
  const {id} = useParams()
  
  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext()
  
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY
  
  const [paymentMethod,setPaymentMethod] = useState('UPI')
  const [phone,setPhone]=useState('')
  const [address,setAddress]=useState('')
  const [upiId,setUpiId]=useState('')
  const [cardHolder,setCardHolder]=useState('')
  const [cardNumber,setCardNumber]=useState('')
  
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/bookings/create',{
        car:id,
        pickupDate,
        returnDate,
        paymentMethod,
        paymentDetails:{
          phone,
          address,
          upiId,
          cardHolder,
          cardLast4:cardNumber.slice(-4)
        }
      })
      if (data.success){
        toast.success(data.message)
        navigate('/my-bookings')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    setCar(cars.find(car => car._id === id))
  },[cars, id])

  useEffect(()=>{

  const fetchBookedDates = async()=>{

    try{

      const {data} = await axios.get(
        `/api/bookings/booked-dates/${id}`
      )

      if(data.success){

        setBookedDates(data.bookedDates)

      }

    }

    catch(error){

      console.log(error)

    }

  }

  if(id){

  fetchBookedDates()

  }

},[id])

const disabledDates=bookedDates.map(date=>new Date(date))

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
        Back to all cars
       </button>

       <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          {/* Left: Car Image & Details */}
          <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className='lg:col-span-2'>
              <motion.img 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}

              src={car.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>
              <motion.div className='space-y-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div>
                  <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                  <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
                </div>
                <hr className='border-borderColor my-6'/>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {[
                    {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
                    {icon: assets.fuel_icon, text: car.fuel_type},
                    {icon: assets.car_icon, text: car.transmission},
                    {icon: assets.location_icon, text: car.location},
                  ].map(({icon, text})=>(
                    <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    
                    key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                      <img src={icon} alt="" className='h-5 mb-2'/>
                      {text}
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Description</h1>
                  <p className='text-gray-500'>{car.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Features</h1>
                  <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    {
                      ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item)=>(
                        <li key={item} className='flex items-center text-gray-500'>
                          <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                          {item}
                        </li>
                      ))
                    }
                  </ul>
                </div>
                    <CarMap location={car.location}/>
              </motion.div>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}

          onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>{currency}{car.pricePerDay}<span className='text-base text-gray-400 font-normal'>per day</span></p> 

            <hr className='border-borderColor my-6'/>

<div className='flex flex-col gap-2'>

<label>

Pickup Date

</label>

<DatePicker

selected={pickup}

onChange={(date)=>{

setPickup(date)

setPickupDate(

date.toISOString()

.split('T')[0]

)

}}

excludeDates={disabledDates}

minDate={new Date()}

dateFormat='dd-MM-yyyy'

placeholderText='Select Pickup Date'

className='border border-borderColor px-3 py-2 rounded-lg w-full'

/>

</div>

<div className='flex flex-col gap-2'>

<label>

Return Date

</label>

<DatePicker

selected={returned}

onChange={(date)=>{

setReturned(date)

setReturnDate(

date.toISOString()

.split('T')[0]

)

}}

excludeDates={disabledDates}

minDate={pickup || new Date()}

dateFormat='dd-MM-yyyy'

placeholderText='Select Return Date'

className='border border-borderColor px-3 py-2 rounded-lg w-full'

/>

</div>
                    <div className='flex flex-col gap-2'>
              <label>
                Payment Method
              </label>
                    <select value={paymentMethod} onChange={(e)=> setPaymentMethod( e.target.value )
                  }
                  className='border border-borderColor px-3 py-2 rounded-lg'
                  >
                    <option value='UPI'>
                  UPI
                  </option>
                  <option value='Card'>
                  Card
                  </option>
                  <option value='Cash'>
                  Cash
                  </option>
                  </select>
                  </div>
 {/* Customer Information */}

<div className='space-y-4'>

<h3 className='font-semibold text-gray-700'>

Customer Information

</h3>

<div className='flex flex-col gap-2'>

<label>

Phone Number

</label>

<input

type='text'

value={phone}

onChange={(e)=>setPhone(e.target.value)}

placeholder='9876543210'

className='border border-borderColor px-3 py-2 rounded-lg'

required

/>

</div>

<div className='flex flex-col gap-2'>

<label>

Address

</label>

<textarea

value={address}

onChange={(e)=>setAddress(e.target.value)}

placeholder='Enter Address'

rows={3}

className='border border-borderColor px-3 py-2 rounded-lg resize-none'

required

/>

</div>

</div>

{

paymentMethod === 'UPI'

&&

(

<div className='space-y-4 p-4 bg-blue-50 rounded-xl border'>

<h3 className='font-semibold text-blue-700'>

📱 UPI Information

</h3>

<div className='flex flex-col gap-2'>

<label>

UPI ID

</label>

<input

type='text'

value={upiId}

onChange={(e)=>setUpiId(e.target.value)}

placeholder='name@oksbi'

className='border border-borderColor px-3 py-2 rounded-lg'

required

/>

</div>

</div>

)

}

{

paymentMethod === 'Card'

&&

(

<div className='space-y-4 p-4 bg-purple-50 rounded-xl border'>

<h3 className='font-semibold text-purple-700'>

💳 Card Information

</h3>

<div className='flex flex-col gap-2'>

<label>

Card Holder Name

</label>

<input

type='text'

value={cardHolder}

onChange={(e)=>setCardHolder(e.target.value)}

placeholder='John Doe'

className='border border-borderColor px-3 py-2 rounded-lg'

required

/>

</div>

<div className='flex flex-col gap-2'>

<label>

Card Number

</label>

<input

type='text'

maxLength={16}

value={cardNumber}

onChange={(e)=>setCardNumber(e.target.value)}

placeholder='1234 5678 9012 3456'

className='border border-borderColor px-3 py-2 rounded-lg'

required

/>

</div>

</div>

)

}

{

paymentMethod === 'Cash'

&&

(

<div className='p-4 bg-green-50 rounded-xl border'>

<h3 className='font-semibold text-green-700'>

💵 Cash Payment

</h3>

<p className='text-sm text-gray-600'>

Cash will be collected at vehicle return.

</p>

</div>

)

}

              <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>Book Now</button>


            <p className='text-center text-sm'>No Credit Card required to reserve</p>

          </motion.form>
       </div>

    </div>
  ) : <Loader />
}

export default CarDetails
