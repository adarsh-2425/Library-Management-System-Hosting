const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors =require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
var session = require('cookie-session');
const schedule = require('node-schedule');



const app = express();

const users = require('./routes/users');
const books = require('./routes/books')
const issuedBooks = require('./routes/issuedBooks');
const search = require('./routes/search')

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/api/books', books);
app.use('/api/search', search);
app.use('/api/issuedbooks', issuedBooks);

// Set Static Folderr
app.use(express.static(`./public`));


// Index Route
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    });
    
app.get('/',(req,res)=>{
    res.send('Invalid endpoint')
})

// Start Server
app.listen(process.env.PORT || 3000, function(){
    console.log("server listening on port %d in %s mode", this.address().port, app.settings.env);
});