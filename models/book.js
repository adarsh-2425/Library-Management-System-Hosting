const mongoose = require('mongoose');

//Book Schema
const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    genre: {
        type: String
    },
    about: {
        type: String
    },
    publicationDate: {
        type: String
    },
    image: {
        type: String
    }
    
});

const Book = module.exports = mongoose.model('Book', BookSchema);

module.exports.addBook = (newBook,callback)=>{
    newBook.save(callback);
};