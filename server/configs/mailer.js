import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({

service:'gmail',

auth:{

user:process.env.EMAIL_USER,

pass:process.env.EMAIL_PASS

}

})

transporter.verify(

(error)=>{

 if(error){

 console.log(

 'Mailer Error:',

 error

 )

 }

 else{

 console.log(

 'Mailer Ready'

 )

 }

})

export const sendWelcomeEmail = async(

name,

email

)=>{

try{

await transporter.sendMail({

from:process.env.EMAIL_USER,

to:email,

subject:'Welcome to Car Rental',

html:`

<h2>Welcome ${name}</h2>

<p>Your account has been successfully created.</p>

<p>Thank you for joining our platform.</p>

`

})

}

catch(error){

console.log(

'Email Error:',

error.message

)

}

}
export default transporter