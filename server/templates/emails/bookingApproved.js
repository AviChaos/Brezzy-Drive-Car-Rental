import emailLayout from "./emailLayout.js"

const bookingApproved = (booking)=>{

return emailLayout(

`<h2>Booking Approved ✅</h2>`,

`

<p>Hello ${booking.user.name},</p>

<p>Your booking has been approved.</p>

<p><strong>Car:</strong>
${booking.car.brand}
${booking.car.model}
</p>

<p><strong>Pickup:</strong>
${new Date(
booking.pickupDate
).toLocaleDateString()}
</p>

<p><strong>Return:</strong>
${new Date(
booking.returnDate
).toLocaleDateString()}
</p>

<p><strong>Payment:</strong>
${booking.paymentMethod}
</p>

`

)

}

export default bookingApproved