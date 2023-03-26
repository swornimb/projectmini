const express = require("express");
const app = express();
var path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const req = require("express/lib/request");

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())


//route transfer
const customerRoute = require("./routes/customer");
const userRoute = require("./routes/users");


app.use(express.static(path.join(__dirname, 'public')));


app.use("/",customerRoute);
app.use("/api/user",userRoute);


app.listen(5000,()=>{
    console.log("server is running")
})