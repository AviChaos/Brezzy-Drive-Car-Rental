import emailLayout from "./emailLayout.js"

const paymentSuccessful=(booking)=>{

return emailLayout(

`<h2>Payment Successful 🎉</h2>`,

`

<p>Hello ${booking.user.name},</p>

<p>Your payment was completed successfully.</p>

<p><strong>Invoice:</strong>

${booking.invoiceNumber}

</p>

<p>You can now download your invoice.</p>

`

)

}

export default paymentSuccessful