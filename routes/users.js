const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();


//REGISTER
router.post('/create', (req,res,next)=>{
    let newUser = new User({
        Name: req.body.Name,
        Approverole: req.body.Approverole,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err,user)=>{
        console.log(newUser.Approverole);
        if(err){
            res.json({success: false, msg:'Failed to register user' })
        }
        else if(newUser.Approverole == 'Librarian'){
            res.json({success: true, msg:'Hello Librarian, You Will Get an Email Notification When Admin Approves Your Credentials.You Can Login After That. Thank You' })
        }
            else{
            res.json({success: true, msg:'Member Registered. You can Login Now.' })
            }
    })

    // Nodemailer stackoverflow
    // https://stackoverflow.com/questions/71573382/what-type-of-email-should-i-use-for-nodemailer-to-not-get-blocked#:~:text=I%20used%20Zoho%20mail%20and,var%20transport%20%3D%20nodemailer.

    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.in", //mail.google.com
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.Email, 
      pass: process.env.Password
    },
    tls:{
        rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Library of Kerala" <adarsh.lol2425@zohomail.in>', // sender address
    to: newUser.email, // list of receivers
    subject: "Account Created", // Subject line
    text:  `Hello ${newUser.Name}.\n
    Your Account is Succesfully created\n
    Welcome to Library of Kerala` // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
});

//Show list of users
router.get('/read',function(req,res){
    // Find all except one in mongodb
    // Use $ne for one user db.user.find( {_id:{$ne:"5848e9ecaec0f31372816a26"} })
    User.find({ _id: { $ne: "636ddb081b87ce086260f5ef"} })
                    .then(function(users){
                        res.send(users);
                    });   
});

// Update Role as Librarian
router.put('/updateuser',(req,res)=>{

    id=req.body._id,
    role = 'Librarian',
   User.findByIdAndUpdate({"_id":id},
                                {$set:{"role":role}})
   .then(function(){
       res.send();
   })
 });

//  Edit Profile
router.put('/update',(req,res)=>{

        id=req.body._id,
        Name= req.body.Name,
        role=req.body.role,
        gender= req.body.gender,
        email= req.body.email,
        about= req.body.about,
        phone=req.body.phone,
        username= req.body.username,
        password = req.body.password

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password, salt, (err, hash)=>{
                if(err) throw err;
                Password = hash;

   User.findByIdAndUpdate({"_id":id},
                                {$set:{
                                    "Name": Name,
                                    'gender': gender,
                                    'email': email,
                                    'role': role,
                                    'about':about,
                                    'phone': phone,
                                    'username': username,
                                    'password': Password
                                }})
   .then(function(err,user){
    res.json({success: true, msg: 'User Updated'})
   })
})
})
 });

//  Delete User
router.delete('/delete/:id', (req,res)=>{
    id = req.params.id;
    User.findByIdAndDelete({"_id":id})
    .then(()=>{
        res.send();
    })
});


// Authenticate
router.post('/authenticate', (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User Not Found'})
        }

        User.comparePassword(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data:user}, 'yoursecret', {
                    expiresIn: 604800 //1 Week

                });
                res.json({
                    success:true,
                    token:`Bearer ${token}`,
                    user: {
                        id: user._id,
                        Name: user.Name,
                        email: user.email,
                        role: user.role,
                    }
                });
            }
            else{
            return res.json({success: false, msg: 'Wrong Password'});
            }
        });
    });
});

//  Search User based on id
router.get('/:id',  (req, res) => {
      
    User.findById(req.params.id)
      .then((user)=>{
          res.send(user);
      });
  })



module.exports = router;