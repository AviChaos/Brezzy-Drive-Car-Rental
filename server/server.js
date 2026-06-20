import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import path from 'path'
import { fileURLToPath } from 'url'

// Initialize Express App
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Connect Database
await connectDB()

// Middleware
const allowedOrigins=[ 'https://brezzy-drive-car-rental-jftz.vercel.app', 'http://localhost:5173' ]
app.use(cors({
origin:true,
credentials:true
}));

app.use(express.json());

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;
const clientPath = path.join(
    __dirname,
    '../client/dist'
)
app.use(
    express.static(clientPath)
)
app.get('*',(req,res)=>{
    res.sendFile(
        path.join(
            clientPath,
            'index.html'
        )
    )
})
app.listen(PORT, ()=> {console.log(`Server running on port ${PORT}`)})