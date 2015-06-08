var express = require('express');
var router = express.Router();
var db = require("../models");

// using the chained route syntax...not for me

// INDEX, CREATE
router.route('/')

  .get(function(req,res){
  db.Author.find({},
    function (err, authors) {
      res.render("authors/index", {authors:authors});
    });
  })

  .post(function(req,res){
  db.Author.create({firstName: req.body.firstName,lastName: req.body.lastName}, function(err, author){
    if(err) {
      console.log(err);
      res.render("authors/new");
    }
    else {
      console.log(author);
      res.redirect("/");
    }
  });
});

// NEW
router.get('/new', function(req,res){
  res.render("authors/new");
});

// EDIT
router.get('/:id/edit', function(req,res){
  db.Author.findById(req.params.id,
    function (err, author) {
      res.render("authors/edit", {author:author});
    });
});


// SHOW, UPDATE, DELETE
router.route('/:id')
  .get(function(req,res){
  db.Author.findById(req.params.id,
    function (err, author) {
      db.Book.find(
      {
        _id: {$in: author.books}
      },
      function(err, books){
        res.render("authors/show", {author:author, books:books});
      });
    });
})
  .put(function(req,res){
 db.Author.findByIdAndUpdate(req.params.id, {firstName: req.body.firstName,lastName: req.body.lastName},
     function (err, author) {
       if(err) {
         res.render("authors/edit");
       }
       else {
         res.redirect("/");
       }
     });
})
  .delete(function(req,res){
  db.Author.findById(req.params.id,
    function (err, author) {
      if(err) {
        console.log(err);
        res.render("authors/show");
      }
      else {
        author.remove();
        res.redirect("/");
      }
    });
});


module.exports = router;