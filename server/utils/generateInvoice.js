import PDFDocument from 'pdfkit'

const generateInvoice = (booking,res)=>{

const doc = new PDFDocument({

margin:50

})

const invoiceNo = booking.invoiceNumber

doc.pipe(res)


// Header

doc

.fontSize(26)

.text('Brezzy Drive',{

align:'center'

})

doc.moveDown()

doc

.fontSize(18)

.text('Rental Invoice',{

align:'center'

})

doc.moveDown(2)


// Customer

doc

.fontSize(14)

.text(`Customer : ${booking.user.name}`)

doc.text(`Email : ${booking.user.email}`)

doc.moveDown()


// Car

doc.text(

`Vehicle : ${booking.car.brand} ${booking.car.model}`

)

doc.text(

`Pickup Date : ${booking.pickupDate.toISOString().split('T')[0]}`

)

doc.text(

`Return Date : ${booking.returnDate.toISOString().split('T')[0]}`

)

doc.moveDown()


// Payment

doc.text(`Invoice Number : ${invoiceNo}`)

doc.text(`Payment Method : ${booking.paymentMethod}`)

doc.text(`Amount Paid : ₹${booking.price}`)

doc.text(`Payment Date : ${booking.paidAt.toISOString().split('T')[0]}`)

doc.moveDown(2)


// Footer

doc

.fontSize(12)

.text(

'Thank you for choosing Brezzy Drive.',

{

align:'center'

}

)

doc.text(

'Drive Smart • Rent Easy',

{

align:'center'

}

)

doc.end()

}

export default generateInvoice