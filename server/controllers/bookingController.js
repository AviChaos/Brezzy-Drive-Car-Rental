import Booking from "../models/Booking.js"
import Car from "../models/Car.js";
import User from "../models/User.js";
import transporter from "../configs/mailer.js";
import bookingApproved from "../templates/emails/bookingApproved.js"
import bookingCancelled from "../templates/emails/bookingCancelled.js"
import paymentSuccessful from "../templates/emails/paymentSuccessful.js"
import paymentUnlocked from "../templates/emails/paymentUnlocked.js"
import generateInvoice from '../utils/generateInvoice.js'

// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        // fetch all available cars for the given location
        const cars = await Car.find({location, isAvaliable: true})

        // check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car)=>{
           const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
           return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const { car, pickupDate, returnDate, paymentMethod, paymentDetails} = req.body;
        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message: "Car is not available"})
        }

        const carData = await Car.findById(car)
        
        // Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
        const price = carData.pricePerDay * noOfDays;

        const booking = await Booking.create({car, owner:carData.owner, user:_id,pickupDate, returnDate, price, paymentMethod, paymentDetails})
        
        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();
        const fullBooking = await Booking
        .findById(bookingId)
        .populate('user')
        .populate('car')
        if(status === 'confirmed'){
        await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:fullBooking.user.email,
            subject:'Booking Approved ✅',
            html:bookingApproved(
                fullBooking
                )
                })
                }
                if(status === 'cancelled'){
                    await transporter.sendMail({
                        from:process.env.EMAIL_USER,
                        to:fullBooking.user.email,
                        subject:'Booking Cancelled ❌',
                        html:bookingCancelled(
                            fullBooking
                            )
                            })
                            }
        res.json({ success: true, message: "Status Updated"})
    } 
    catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Return Car

export const returnCar = async (req,res)=>{

try{

const {_id}=req.user

const {bookingId}=req.body

const booking=await Booking.findById(bookingId)

if(!booking){

return res.json({

success:false,

message:'Booking not found'

})

}

if(booking.owner.toString() !== _id.toString()){

return res.json({

success:false,

message:'Unauthorized'

})

}

booking.returnStatus='returned'

booking.returnedAt=new Date()

booking.paymentStatus='pending'

await booking.save()


// Send Payment Unlocked Email

const fullBooking = await Booking

.findById(bookingId)

.populate('user')

.populate('car')


await transporter.sendMail({

from:process.env.EMAIL_USER,

to:fullBooking.user.email,

subject:'Payment Unlocked 💳',

html:paymentUnlocked(fullBooking)

})


res.json({

success:true,

message:'Car Returned. Payment unlocked.'

})

}

catch(error){

console.log(error.message)

res.json({

success:false,

message:error.message

})

}

}

// API to Complete Payment

export const completePayment = async (req,res)=>{

try{

const {_id}=req.user

const {bookingId}=req.body

const booking = await Booking.findById(bookingId)

if(!booking){

return res.json({

success:false,

message:'Booking not found'

})

}

if(booking.user.toString() !== _id.toString()){

return res.json({

success:false,

message:'Unauthorized'

})

}

if(booking.paymentStatus !== 'pending'){

return res.json({

success:false,

message:'Payment is locked'

})

}


booking.paymentStatus='paid'

booking.paidAt=new Date()

booking.invoiceNumber=`INV-${Date.now()}`

await booking.save()


const fullBooking = await Booking

.findById(bookingId)

.populate('user')

.populate('car')


await transporter.sendMail({

from:process.env.EMAIL_USER,

to:fullBooking.user.email,

subject:'Payment Successful 🎉',

html:paymentSuccessful(fullBooking)

})


res.json({

success:true,

message:'Payment successful'

})

}

catch(error){

console.log(error.message)

res.json({

success:false,

message:error.message

})

}

}

// API for Calendar

export const getBookedDates = async (req,res)=>{

try{

const { carId } = req.params

const bookings = await Booking.find({

car:carId,

status:'confirmed'

})

.select('pickupDate returnDate')

let bookedDates=[]

bookings.forEach((booking)=>{

let currentDate = new Date(booking.pickupDate)

let endDate = new Date(booking.returnDate)

while(currentDate <= endDate){

bookedDates.push(

currentDate.toISOString().split('T')[0]

)

currentDate.setDate(

currentDate.getDate()+1

)

}

})

res.json({

success:true,

bookedDates

})

}

catch(error){

res.json({

success:false,

message:error.message

})

}

}

// API for Invoice

export const downloadInvoice = async(req,res)=>{

try{

const {bookingId}=req.params

const booking = await Booking

.findById(bookingId)

.populate('user')

.populate('car')

if(!booking){

return res.json({

success:false,

message:'Invoice not found'

})

}

res.setHeader(

'Content-Type',

'application/pdf'

)

res.setHeader(

'Content-Disposition',

`attachment; filename=${booking.invoiceNumber}.pdf`

)

generateInvoice(

booking,

res

)

}

catch(error){

res.json({

success:false,

message:error.message

})

}

}