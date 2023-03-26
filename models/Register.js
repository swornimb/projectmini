const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookit');

const registerSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
}});
module.exports= mongoose.model('register' ,registerSchema)