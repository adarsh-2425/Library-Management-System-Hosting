const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    database:"mongodb+srv://admin:mongo@cluster-library-managem.nzll4mc.mongodb.net/UserDB?retryWrites=true&w=majority",
    secret: 'yoursecret'
}
// Connect to Database
mongoose.connect(process.env.MONGODB_URI);


// On Connection
mongoose.connection.on('connected',()=>{
    console.log('Connected to Database');
});

// On Error
mongoose.connection.on('error',(err)=>{
    console.log('Database error:' +err);
});