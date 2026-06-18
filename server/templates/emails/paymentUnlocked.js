import emailLayout

from "./emailLayout.js"

const paymentUnlocked=(booking)=>{

return emailLayout(

`<h2>Payment Unlocked 💳</h2>`,

`

<p>

Hello ${booking.user.name},

</p>

<p>

The owner has marked the car as returned.

</p>

<p>

You may now complete your payment.

</p>

<p>

Once payment is done,

your invoice will unlock.

</p>

`

)

}

export default paymentUnlocked