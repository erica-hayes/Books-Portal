const Book = require('../models/book-model');
const router = require('express').Router();
const Sequelize = require('sequelize');

router.post('/addBook', (req, res)=>{
        Book.create({image: req.body.image,
                    title: req.body.title,
                    contact: req.body.contact,
                    phone: req.body.phone,
                    email: req.body.email,
                    abstract: req.body.abstract,
                    author: req.body.author,
                    publish_date: req.body.publish_date,
                    category: req.body.category,
            }).then((book)=>{    
                
                   return res.status(200).json({msg: `${book.title} has been added successfully`})}).catch((err)=>{ return res.status(500);});
    
    

});

router.get('/getBooks', (req, res)=>{
        Book.findAll()
            .then((books)=>{
                return res.status(200).json({books});
            })
            .catch((err)=>{
                return res.status(500).send(err);
            });
});

router.get('/getBook/:id', (req, res)=>{
       Book.findOne({where: {ID: req.params.id}})
            .then((book)=>{
                if (!book) {
                    return res.status(404).json({error: 'Book not found'});
                }
                return res.status(200).json({book});
            })
            .catch((err)=>{
                return res.status(500).send(err);
            });
});

router.patch('/changeBook/:id', (req, res)=>{
        Book.findOne({where: {ID: req.params.id}})
            .then((book)=>{
                if (!book) {
                    return res.status(404).json({success: false, error: 'Book not found'});
                }

                if (book.status === 'available' && !book.borrowedBy) {
                    book.status = 'not available';
                    book.borrowedBy = req.body.email;
                } else if (book.status === 'not available' && req.body.email === book.borrowedBy) {
                    book.status = 'available';
                    book.borrowedBy = null;
                } else {
                    return res.status(400).json({success: false, error: 'Invalid book status or borrower email'});
                }

                return book.save()
                    .then((updatedBook)=>{
                        return res.status(200).json({book: updatedBook, success: true});
                    });
            })
            .catch((err)=>{
                return res.status(500).send(err);
            });
});

module.exports = router;