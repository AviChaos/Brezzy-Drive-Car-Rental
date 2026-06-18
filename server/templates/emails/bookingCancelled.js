import emailLayout from "./emailLayout.js"

const bookingCancelled=(booking)=>{

return emailLayout(

`<h2>Booking Cancelled ❌</h2>`,

`

<p>Hello ${booking.user.name},</p>

<p>Your booking request was cancelled.</p>

<p>Please book another vehicle.</p>

`

)

}

export default bookingCancelled