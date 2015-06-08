var express = require('express');
var authors = require('./authors');
// need to merge params to get access to parent IDs
var router = express.Router({mergeParams:true});
var db = require("../models");

// need to prefix these routes with the parent route
router.use('/:author_id/books', authors);


// INDEX
router.get('/', function(req,res){
  db.Author.findById(req.params.author_id).populate('books').exec(function(err,author){
    res.render("books/index", {author:author});
  });
});

// NEW
router.get('/new', function(req,res){
  db.Author.findById(req.params.author_id,
    function (err, author) {
      res.render("books/new", {author:author});
    });
});

// CREATE
router.post('/', function(req,res){
  db.Book.create({title:req.body.title,}, function(err, book){
    if(err) {
      console.log(err);
      res.render("books/new");
    }
    else {
      db.Author.findById(req.params.author_id,function(err,author){
        author.books.push(book);
        book.author = author._id;
        book.save();
        author.save();
        res.redirect("/authors/"+ req.params.author_id +"/books");
      });
    }
  });
});

// SHOW
router.get('/:id', function(req,res){
  db.Book.findById(req.params.id)
    .populate('author')
    .exec(function(err,book){
      res.render("books/show", {book:book});
    });
});

// EDIT
router.get('/:id/edit', function(req,res){
  // db.Author.findById(req.params.author_id,
  //     function (err, author) {
  //       db.Book.findById(req.params.id,
  //       function(err, book){
  //         res.render("books/edit", {author:author,book:book});
  //       });
  //     });

  // REFACTOR USING POPULATE
  db.Book.findById(req.params.id)
    .populate('author')
    .exec(function(err,book){
      res.render("books/edit", {book:book});
    });
});

// UPDATE
router.put('/:id', function(req,res){
 db.Book.findByIdAndUpdate(req.params.id, {title:req.body.title},
     function (err, book) {
       if(err) {
         res.render("books/edit");
       }
       else {
         res.redirect("/authors/" + req.params.author_id + "/books");
       }
     });
});

// DESTROY
router.delete('/:id', function(req,res){
 db.Book.findByIdAndRemove(req.params.id, {title:req.body.title},
      function (err, book) {
        if(err) {
          console.log(err);
          res.render("books/edit");
        }
        else {
          res.redirect("/authors/" + req.params.author_id + "/books");
        }
      });
});

module.exports = router;