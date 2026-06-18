import express from "express";
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings, returnCar, completePayment, downloadInvoice} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";
import {getBookedDates} from '../controllers/bookingController.js'

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar)
bookingRouter.get('/booked-dates/:carId',getBookedDates)
bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, changeBookingStatus)
bookingRouter.post( '/return-car', protect, returnCar )
bookingRouter.post( '/complete-payment', protect, completePayment)
bookingRouter.get( '/invoice/:bookingId', downloadInvoice )

export default bookingRouter;