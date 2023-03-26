const { Router } = require("express");
const express = require("express");
const { route } = require("express/lib/router");
const router = Router();
const Busses = require("../models/Busses");
const Bookings = require("../models/Bookings");
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/result", async (req, res) => {
  const myquery = req.query;
  var busses = await Busses.find({
    from: myquery.from,
    to: myquery.to,
    date: myquery.date,
  });
  res.render("result", { busses: busses });
});

router.post("/bookings/:id", async (req, res) => {
  let my_parms = req.params.id;
  console.log(my_parms);
  var total = req.body.total;
  var seats = req.body.seats;
  var MyclientName = req.body.clientName,
    seats = seats.split(",");

  const Myoutput = `
    <p>Reciept</p>
    <ul>
        <li>Name: ${MyclientName}</li>
        <li>Seats: ${seats}</li>
        <li>Total: ${total}</li>
    </ul>
    
    `;

  var bus = await Busses.findByIdAndUpdate(req.params.id, {
    $push: {
      booked: seats,
    },
  });
  var booking = await new Bookings({
    busID: my_parms,
    clientName: req.body.clientName,
    phoneNumber: req.body.phoneNumber,
    booked: seats,
    total: total,
  });
  await booking.save();
  myMailer(Myoutput);
  res.redirect("/");
});

("use strict");

async function myMailer(Myoutput) {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "***", // generated ethereal user
      pass: "****", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Bookit" <aaa@gmail.com>', // sender address
    to: "aaa@gmail.com", // list of receivers
    subject: "Reciept", // Subject line
    text: "Hello world?", // plain text body
    html: Myoutput, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = router;
