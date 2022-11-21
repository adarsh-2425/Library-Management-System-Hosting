const express = require('express');
const router = express.Router();
const Book = require('../models/book');

//Add Book
router.post('/create', (req,res)=>{
    let newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        about: req.body.about,
        publicationDate: req.body.publicationDate,
        image: req.body.image
    });
    Book.addBook(newBook, (err,book)=>{
        if(err){
            res.json({success: false, msg: 'Failed to add book'});
        }
        else{
            res.json({success: true, msg: 'Book added'})
        }
    })
});

//Read All Book
router.get('/read',(req,res)=>{
    Book.find()
    .then((books,err)=>{
        res.send(books);
        if(err) throw err;
    })
});

//Read Individual Book By id
router.get('/readone/:id', (req,res)=>{
    Book.findById(req.params.id)
      .then((book)=>{
          res.send(book);
      });
});

//Update Books
router.put('/update',(req,res)=>{
    id = req.body._id,
    title = req.body.title,
    author = req.body.author,
    genre = req.body.genre,
    about = req.body.about,
    publicationDate = req.body.publicationDate,
    image = req.body.image,
    Book.findByIdAndUpdate({'_id':id},
    {
        $set: {
            "title":title,
            'author':author,
            'genre':genre,
            'about':about,
            'publicationDate':publicationDate,
            'image':image
        }
    })
    .then((book,err)=>{
        if(err){
            res.json({success: false, msg: 'Failed to update book  '})
        }
        else{
            res.json({success: true, msg: 'Book Updated'})
        }
    })
});

//Delete Book
router.delete('/delete/:id',(req,res)=>{
    id = req.params.id;
    Book.findByIdAndDelete({'_id':id})
    .then((book,err)=>{
        if(err){
            res.json({success: false, msg: 'Failed to Delete book  '})
        }
        else{
            res.json({success: true, msg: 'Book Deleted'})
        }
    })
})



module.exports = router;