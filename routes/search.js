const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Search 
router.post('/',  (req,res)=>{
    const { queryType, query } = req.body;
    
    switch(queryType){
        case 'title':
            Book.find({'title':query})
            .then((item)=>{
            res.send(item)
        })
        break;

        case 'author':
            Book.find({'author':query})
            .then((item)=>{
            res.send(item)
        })
        break;

        case 'genre':
            Book.find({'genre':query})
            .then((item)=>{
            res.send(item)
        })
        break;
        case 'publicationDate':
            Book.find({'publicationDate':query})
            .then((item)=>{
            res.send(item)
        })
        break;
    }
    });

module.exports = router;