const express = require('express');
const router = express.Router();
const IssuedBook = require('../models/issuedBook');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
require('dotenv').config();

//View all books
router.get('/read',(req,res)=>{
    IssuedBook.find()
    .then((data)=>{
        res.send(data)
    })
});


//MEMBER ROUTES

//Take Book by Member
router.post('/takebook', (req,res)=>{
    let newIssuedBook = new IssuedBook({
        title: req.body.title,
        image: req.body.image,
        memberName: req.body.memberName,
        memberEmail: req.body.memberEmail,
    });

    //checking if member already took more than 5 books
    memberName = newIssuedBook.memberName;
    var query = IssuedBook.find({'memberName':memberName});
    query.count(function (err, count) {
    if (err) throw (err)
    else
    if(count <= 4){

        //Submitting book to librarian
        IssuedBook.addBook(newIssuedBook, (err,book)=>{
            if(err){
                res.json({success: false, msg: 'Failed to Take book'})
            }
            else{
                res.json({success: true, msg: 'Book Submitted to Librarian. You will get an email when your book is issued. Thank You'})
            }
        })
    }
    else{
        res.json({success: false, msg: 'Allotted Number of Books Taken. Contact Your Librarian'});
    }
});


   
    //confirmation email logic

});

//View the books submitted  by member
router.get('/viewsubmittedbooks/:email', (req,res)=>{
    memberEmail = req.params.email;
    //in postman, http://localhost:3000/issuedbooks/viewbooks/adarsh.lol2425@gmail.com
    IssuedBook.find({
        'memberEmail': memberEmail,
        'issued':{$ne: true}
    })
    .then((books)=>{
        res.send(books)
    })
   
});

//View the books issued for member
router.get('/viewissuedbooks/:email', (req,res)=>{
    memberEmail = req.params.email;
    IssuedBook.find({
        'memberEmail': memberEmail,
        'issued':{$ne: null}
    })
    .then((books)=>{
        res.send(books)
    })
   
});



//LIBRARIAN ROUTES

//Issue Book By Librarian
router.put('/issuebook',(req,res)=>{
    id = req.body._id,
    title = req.body.title,
    memberEmail = req.body.memberEmail,
    dueDate = req.body.dueDate,
    issued = 'true',
    remarks = req.body.remarks,

    IssuedBook.findByIdAndUpdate({'_id':id},
    {
        '$set': {
            'dueDate':dueDate,
            'issued':issued,
            'remarks':remarks
        }
    })
    .then(()=>{
        res.send();

        
    });

     // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    host: "smtp.zoho.in", //mail.google.com
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.Email, // user
      pass: process.env.Password // password
    },
    tls:{
        rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Library of Kerala" <adarsh.lol2425@zohomail.in>', // sender address
    to: memberEmail, // list of receivers
    subject: "Book Issued by Librarian", // Subject line
    text: `Book "${title}" is Issued.\n
    Due Date : ${dueDate}.\n
    Please Return the Book Within Due Date.\n
    Remarks : ${remarks}`, // plain text body
  };

   // send mail with defined transport object
   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });

    // Scheduling before due date
    var TestDatee = dueDate +'T00:00:00.000Z';

    var datee = new Date(TestDatee);

    //Convert Date to Yesterday date
    var yesterdayy = new Date(datee - 24*60*60*1000);

    //Replacing 'Z' from output date. Because node scheduler doesnt work if 'Z' presents.
    var noww = yesterdayy.toISOString().replace('Z', '');
       
    
      let testJob = 'test1'; //assigning id
      let Job = schedule.scheduleJob(testJob,noww,()=>{
        //Job Here
        console.log(noww);
        // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.zoho.in", //mail.google.com
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.Email, // user
          pass: process.env.Password // password
        },
        tls:{
            rejectUnauthorized:false
        }
      });
      
        let mailOptions = {
            from: '"Library of Kerala" <adarsh.lol2425@zohomail.in>', // sender address
            to: memberEmail, // list of receivers
            subject: "Due Date is Tomorrow", // Subject line
            text: `Return your Book Immediately`, // plain text body
          };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          });
                //Stopping the Job
                let current_job = schedule.scheduledJobs[testJob]
                current_job.cancel();   
    })
})

//Books waiting to be issued
router.get('/waiting', (req,res)=>{
    IssuedBook.find({"issued": { $ne: true}})
    .then((books)=>{
        res.send(books)
    })
});

//Read All Issued Books
router.get('/issued', (req,res)=>{
    IssuedBook.find({"issued": { $ne: null}})
    .then((books)=>{
        res.send(books)
    })
});

//Remainder


//Delete Returned Books from Issuedbooks DB
router.delete('/delete/:id',(req,res)=>{
    id = req.params.id;
    IssuedBook.findByIdAndDelete({'_id':id})
    .then(()=>{
        res.send();
    })
});


module.exports = router;    