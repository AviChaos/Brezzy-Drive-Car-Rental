import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types

const bookingSchema = new mongoose.Schema({

    car:{
        type:ObjectId,
        ref:"Car",
        required:true
    },

    user:{
        type:ObjectId,
        ref:"User",
        required:true
    },

    owner:{
        type:ObjectId,
        ref:"User",
        required:true
    },

    pickupDate:{
        type:Date,
        required:true
    },

    returnDate:{
        type:Date,
        required:true
    },

    status:{
        type:String,
        enum:["pending","confirmed","cancelled"],
        default:"pending"
    },

    price:{
        type:Number,
        required:true
    },

    // Payment Method

    paymentMethod:{
        type:String,
        enum:["UPI","Card","Cash"],
        default:"UPI"
    },
    paymentDetails:{

phone:{
type:String,
default:''
},

address:{
type:String,
default:''
},

upiId:{
type:String,
default:''
},

cardHolder:{
type:String,
default:''
},

cardLast4:{
type:String,
default:''
}

},
    
// Payment Flow

    paymentStatus:{
        type:String,
        enum:["locked","pending","paid"],
        default:"locked"
    },

    // Car Return Flow

    returnStatus:{
        type:String,
        enum:["ongoing","returned"],
        default:"ongoing"
    },

    returnedAt:{
        type:Date,
        default:null
    },

    // Invoice

    invoiceNumber:{
        type:String,
        default:""
    },

    paidAt:{
        type:Date
    },

    invoiceUrl:{
        type:String,
        default:''
    }

},
{
    timestamps:true
})

const Booking = mongoose.model(
    'Booking',
    bookingSchema
)

export default Booking