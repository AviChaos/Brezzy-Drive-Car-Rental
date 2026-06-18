import React, { useEffect, useState } from 'react'

import Title from '../../components/owner/Title'

import { useAppContext } from '../../context/AppContext'

import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])

  // Fetch Owner Bookings

  const fetchOwnerBookings = async ()=>{

    try{

      const {data} = await axios.get('/api/bookings/owner')

      if(data.success){

        setBookings(data.bookings)

      }

      else{

        toast.error(data.message)

      }

    }

    catch(error){

      toast.error(error.message)

    }

  }

  // Approve / Cancel Booking

  const changeBookingStatus = async(

    bookingId,

    status

  )=>{

    try{

      const {data}=await axios.post(

        '/api/bookings/change-status',

        {

          bookingId,

          status

        }

      )

      if(data.success){

        toast.success(data.message)

        fetchOwnerBookings()

      }

      else{

        toast.error(data.message)

      }

    }

    catch(error){

      toast.error(error.message)

    }

  }

  // Return Car

  const returnCar = async(

    bookingId

  )=>{

    try{

      const {data}=await axios.post(

        '/api/bookings/return-car',

        {

          bookingId

        }

      )

      if(data.success){

        toast.success(data.message)

        fetchOwnerBookings()

      }

      else{

        toast.error(data.message)

      }

    }

    catch(error){

      toast.error(error.message)

    }

  }

  const downloadInvoice = (bookingId)=>{

window.open(

`${axios.defaults.baseURL}/api/bookings/invoice/${bookingId}`,

'_blank'

)

}

  useEffect(()=>{

    fetchOwnerBookings()

  },[])

  return (

    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title

      title='Manage Bookings'

      subTitle='Track all customer bookings.'

      />

      <div className='w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>

          <thead className='text-gray-500'>

            <tr>

              <th className='p-3'>Car</th>

              <th className='p-3 max-md:hidden'>

                Date Range

              </th>

              <th className='p-3'>

                Total

              </th>

              <th className='p-3 max-md:hidden'>

                Payment

              </th>

              <th className='p-3'>

                Invoice

              </th>

              <th className="p-3 font-medium">Actions</th>
              
            </tr>

          </thead>

          <tbody>

          {

            bookings.map((booking,index)=>(

              <tr

              key={index}

              className='border-t border-borderColor text-gray-500'

              >

                {/* Car */}

                <td className='p-3 flex items-center gap-3'>

                  <img

                  src={booking.car.image}

                  alt=''

                  className='h-12 w-12 rounded-md object-cover'

                  />

                  <p className='font-medium max-md:hidden'>

                    {booking.car.brand}

                    {' '}

                    {booking.car.model}

                  </p>

                </td>

                {/* Dates */}

                <td className='p-3 max-md:hidden'>

                  {booking.pickupDate.split('T')[0]}

                  {' to '}

                  {booking.returnDate.split('T')[0]}

                </td>

                {/* Price */}

                <td className='p-3'>

                  {currency}

                  {booking.price}

                </td>
                  
                {/* Payment */}

                <td className='p-3 max-md:hidden'>

                  <div className='flex flex-col gap-1'>

                    <span className='font-semibold'>

                      {booking.paymentMethod}

                    </span>

                    <span className='text-xs'>

                      {booking.paymentStatus}

                    </span>

                  </div>

                </td>

                                  <td className='p-3'>

{

booking.paymentStatus === 'paid'

?

(

<button

onClick={()=>downloadInvoice(

booking._id

)}

className='bg-blue-600 text-white px-3 py-1 rounded'

>

Download

</button>

)

:

(

<span className='text-gray-400'>

-

</span>

)

}

</td>

               {/* Actions */}

                <td className='p-3'>

                {

                  booking.status === 'pending'

                  ?

                  (

                    <select

                    value={booking.status}

                    onChange={(e)=>

                    changeBookingStatus(

                      booking._id,

                      e.target.value

                    )

                    }

                    className='px-2 py-1 border border-borderColor rounded-md'

                    >

                      <option value='pending'>

                        Pending

                      </option>

                      <option value='confirmed'>

                        Confirmed

                      </option>

                      <option value='cancelled'>

                        Cancelled

                      </option>

                    </select>

                  )

                  :

                  (

                    <div className='flex flex-col gap-2'>

                      <span

                      className={`px-3 py-1 rounded-full text-xs font-semibold

                      ${booking.status === 'confirmed'

                      ?

                      'bg-green-100 text-green-500'

                      :

                      'bg-red-100 text-red-500'

                      }`}

                      >

                        {booking.status}

                      </span>

                      {

                        booking.status === 'confirmed'

                        &&

                        booking.returnStatus === 'ongoing'

                        &&

                        (

                          <button

                          onClick={()=>

                          returnCar(

                            booking._id

                          )

                          }

                          className='bg-blue-600 text-white px-3 py-1 rounded'

                          >

                            Return Car

                          </button>

                        )

                      }

                      {

                        booking.returnStatus === 'returned'

                        &&

                        (

                          <span className='text-green-600 text-xs font-semibold'>

                            Returned ✓

                          </span>

                        )

                      }

                    </div>

                  )

                }

                </td>

              </tr>

            ))

          }

          </tbody>

        </table>

      </div>

    </div>

  )

}

export default ManageBookings