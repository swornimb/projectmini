const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookit');

const bookingSchema = new mongoose.Schema({
    busID:{
        type: String,
    },
    clientName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    booked:{
        type:Array,
        default:[]
    },
    total:{
        type:String
    }
})
module.exports= mongoose.model('bookings' ,bookingSchema)