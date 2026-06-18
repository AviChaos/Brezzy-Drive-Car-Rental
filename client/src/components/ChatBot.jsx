import React, { useState } from 'react'

import { useAppContext } from '../context/AppContext'

const ChatBot = () => {

const { cars, currency } = useAppContext()

const [open, setOpen] = useState(false)

const [loading, setLoading] = useState(false)

const [messages, setMessages] = useState([

{

sender:'bot',

text:`Hello 👋

I am your Car Rental AI Assistant.

I can help with:

🚗 Cars

📅 Bookings

📍 Locations

📊 Dashboard

💻 Project Questions`

}

])

const [input,setInput] = useState('')

const quickActions = [

'🚗 Available Cars',

'📅 Bookings',

'📍 Locations',

'💻 Technologies'

]

const getResponse = (question)=>{

const text = question.toLowerCase()

if(

text.includes('available')

||

text.includes('cars')

){

return `There are currently ${cars.length} cars available.`

}

if(

text.includes('book')

){

return 'Open a car page, select dates and click Book Now.'

}

if(

text.includes('location')

||

text.includes('map')

){

return 'Every car page contains an interactive map.'

}

if(

text.includes('dashboard')

){

return 'Dashboard displays analytics, charts, bookings and revenue.'

}

if(

text.includes('technology')

||

text.includes('technologies')

||

text.includes('stack')

){

return `

Frontend: React 

Backend: Node.js + Express

Database: MongoDB

Maps: React Leaflet

Charts: Chart.js

Authentication: JWT

`

}

if(

text.includes('currency')

){

return `Current currency: ${currency}`

}

if(

text.includes('owner')

){

return 'Owners can add, manage and monitor their cars.'

}

return 'I am still learning. Please ask another question.'

}

const askQuestion = (question)=>{

const userMessage = {

sender:'user',

text:question

}

setMessages(

prev=>[

...prev,

userMessage

]

)

setLoading(true)

setTimeout(()=>{

const botMessage = {

sender:'bot',

text:getResponse(question)

}

setMessages(

prev=>[

...prev,

botMessage

]

)

setLoading(false)

},1000)

}

const sendMessage = ()=>{

if(!input.trim())

return

askQuestion(input)

setInput('')

}

return(

<>

<button

onClick={()=>setOpen(!open)}

className='fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl bg-primary text-white text-3xl hover:scale-110 transition-all'

>

🤖

</button>

{

open && (

<div className='fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-borderColor z-50 overflow-hidden'>

<div className='bg-primary text-white p-4 font-semibold'>

AI Assistant

</div>

<div className='p-3 flex flex-wrap gap-2 border-b'>

{

quickActions.map((item)=>(

<button

key={item}

onClick={()=>askQuestion(item)}

className='text-xs px-3 py-2 bg-gray-100 rounded-full'

>

{item}

</button>

))

}

</div>

<div className='h-96 overflow-y-auto p-4 space-y-3'>

{

messages.map((msg,index)=>(

<div

key={index}

className={`p-3 rounded-xl max-w-[85%]

${

msg.sender==='user'

?

'bg-primary text-white ml-auto'

:

'bg-gray-100'

}

`}

>

{msg.text}

</div>

))

}

{

loading && (

<div className='bg-gray-100 p-3 rounded-xl w-fit'>

AI Assistant is typing...

</div>

)

}

</div>

<div className='flex border-t'>

<input

value={input}

onChange={(e)=>

setInput(

e.target.value

)

}

onKeyDown={(e)=>{

if(e.key==='Enter'){

sendMessage()

}

}}

placeholder='Ask something...'

className='flex-1 p-3 outline-none'

/>

<button

onClick={sendMessage}

className='px-5 font-semibold text-primary'

>

Send

</button>

</div>

</div>

)

}

</>

)

}

export default ChatBot