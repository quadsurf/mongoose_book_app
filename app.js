var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require('method-override'),
db = require("./models");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

// ROOT
app.get('/', function(req,res){
  res.redirect("/books");
});

// INDEX
app.get('/books', function(req,res){
  db.Book.find({},
    function (err, books) {
      res.render("index", {books:books});
    });
});

// NEW
app.get('/books/new', function(req,res){
  res.render("new");
});

// CREATE
app.post('/books', function(req,res){
  db.Book.create({title: req.body.title}, function(err, book){
    if(err) {
      console.log(err);
      res.render("new");
    }
    else {
      console.log(book);
      res.redirect("/books");
    }
  });
});

// SHOW
app.get('/books/:id', function(req,res){
  db.Book.findById(req.params.id,
    function (err, book) {
      res.render("show", {book:book});
    });
});

// EDIT
app.get('/books/:id/edit', function(req,res){
  db.Book.findById(req.params.id,
    function (err, book) {
      res.render("edit", {book:book});
    });
});

// UPDATE
app.put('/books/:id', function(req,res){
 db.Book.findByIdAndUpdate(req.params.id, {title:req.body.title},
     function (err, book) {
       if(err) {
         console.log(err);
         res.render("edit");
       }
       else {
         res.redirect("/books");
       }
     });
});

// DESTROY
app.delete('/books/:id', function(req,res){
  db.Book.findByIdAndRemove(req.params.id,
    function (err, book) {
      if(err) {
        console.log(err);
        res.render("show");
      }
      else {
        res.redirect("/books");
      }
    });
});

// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});
