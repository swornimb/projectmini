const { Router } = require("express");
const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { route } = require("express/lib/router");
const { findOne } = require("../models/Busses");
const router = Router();
const Busses = require("../models/Busses");
const Bookings = require('../models/Bookings')
const Register = require('../models/Register');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
function checkLoginUser (req, res, next){
  try {
    var userToken = localStorage.getItem('userToken');
    var username = localStorage.getItem('username');
    var decoded = jwt.verify(userToken, 'secretOrPrivateKey');
    console.log(decoded)
    
    
  } catch(err) {
    res.redirect('/');
  }
  next();
}

router.get('/logout', function(req,res,next){
  localStorage.removeItem('userToken');
  localStorage.removeItem('username');
  res.redirect('/');
});



router.get('/register', (req, res)=>{
    res.render('register');
})

router.post('/register', async(req, res)=>{ 
    await bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
         var addit =  new Register({
        username: req.body.username,
        password: hash
    })
    addit.save()
    res.render('register');
    });
});   
})


router.get('/login', (req, res)=>{
    res.render('login');
})

router.post('/login', async(req, res)=>{
    var allLogin = await Register.findOne({username: req.body.username});
    var Password = req.body.password
    if(allLogin!=null){
            bcrypt.compare(Password, allLogin.password, function(err, data) {
            if(data){
                var token = jwt.sign(
                    {
                        Username:allLogin.username,
                        password:allLogin.password
                    
                    }, "secretOrPrivateKey", {expiresIn:120000})
                    localStorage.setItem('userToken',token);
                    localStorage.setItem('username',req.body.username);
                res.redirect('dashboard');
            }else{
                res.redirect('login');
            }
});

    }else{
        res.redirect('login');
    }
})


router.get('/dashboard', checkLoginUser, async (req, res)=>{
    var payload =  await Busses.find();
    console.log(localStorage.getItem('username'))
    res.render('dashboard', {payload:payload, username:localStorage.getItem('username')})
    
})

router.get("/search",checkLoginUser,async(req,res)=>{
    const myquery= req.query;
    var busses = await Busses.find({from:myquery.from});
    var bookings_details = await Bookings.find();
    res.render('bookings',{busses: busses,bookings_details:bookings_details,username: localStorage.getItem('username')})

})

router.get('/addBus',checkLoginUser,(req, res)=>{
res.render('addBus',{username: localStorage.getItem('username')})
})

router.post("/addBus",checkLoginUser,async (req,res)=>{
    var user = req.body.user;
    var from = req.body.from;
    var to = req.body.to;
    var date = req.body.date;
    var time = req.body.time;
    var bustype = req.body.bustype;
    var duration = req.body.duration;
    var fare = req.body.fare;
    var departureTime = req.body.departureTime;
    var departurePlace = req.body.departurePlace;
    var dropping = req.body.dropping;

    var bus = await new Busses({
        user: user,
        from: from,
        to: to,
        date: date,
        time: time,
        bustype: bustype,
        duration: duration,
        fare: fare,
        departurePlace: departurePlace,
        departureTime: departureTime,
        dropping: dropping

    })
    await bus.save();
    res.redirect("addBus");
});


router.get("/editBus/:id",checkLoginUser,(req,res)=>{ 
    
    var bus  = Busses.findById(req.params.id);
    bus.exec((err,data)=>{
        if(err){
            throw err
        }else{
            res.render('editBus',{data:data});
        }
    })    
});

router.post("/editBus/:id",checkLoginUser,async (req,res)=>{ 
    var user = req.body.user;
    var from = req.body.from;
    var to = req.body.to;
    var date = req.body.date;
    var time = req.body.time;
    var bustype = req.body.bustype;
    var duration = req.body.duration;
    var fare = req.body.fare;
    var departureTime = req.body.departureTime;
    var departurePlace = req.body.departurePlace;
    var dropping = req.body.dropping;
    console.log(req.body)
    var bus  = await Busses.findByIdAndUpdate(req.params.id,{
        user: user,
        from: from,
        to: to,
        date: date,
        time: time,
        bustype: bustype,
        duration: duration,
        fare: fare,
        departurePlace: departurePlace,
        departureTime: departureTime,
        dropping: dropping
        }
    );
     
   await res.redirect('/api/user/dashboard') 
    
});
router.delete("/delete/:id",checkLoginUser,async (req,res)=>{ 

    var bus  = await Busses.findByIdAndDelete(req.params.id);
     
   await res.redirect('dashboard'); 

    
});


module.exports = router