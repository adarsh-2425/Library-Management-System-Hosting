const mongoose = require('mongoose');

const issuedBookSchema = mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    memberName: {
        type: String
    },
    memberEmail: {
        type: String
    },
    dueDate: {
        type: String
    },
    remarks: {
        type: String
    },
    issued: {
        type: Boolean
    }
});

const IssuedBook = module.exports = mongoose.model('IssuedBook', issuedBookSchema);

module.exports.addBook = (newIssuedBook,callback)=>{
    newIssuedBook.save(callback);
};