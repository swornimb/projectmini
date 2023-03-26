const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookit');

const bussesSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    bustype:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    fare:{
        type:String,
        required:true
    },
    departureTime:{
        type:String,
        required:true
    },
    departurePlace:{
        type:String,
        required:true
    },
    dropping:{
        type:String,
        required:true
    },
    booked:{
        type:Array,
        default:[]
    },
    from:{
        type:String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
})
    module.exports= mongoose.model('busses' ,bussesSchema)