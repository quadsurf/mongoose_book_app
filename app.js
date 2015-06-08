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
  res.redirect("/authors");
});

// INDEX
app.get('/authors', function(req,res){
  db.Author.find({},
    function (err, authors) {
      res.render("authors/index", {authors:authors});
    });
});

// NEW
app.get('/authors/new', function(req,res){
  res.render("authors/new");
});

// CREATE
app.post('/authors', function(req,res){
  db.Author.create({firstName: req.body.firstName,lastName: req.body.lastName}, function(err, author){
    if(err) {
      console.log(err);
      res.render("authors/new");
    }
    else {
      console.log(author);
      res.redirect("/authors");
    }
  });
});

// SHOW
app.get('/authors/:id', function(req,res){
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
});

// EDIT
app.get('/authors/:id/edit', function(req,res){
  db.Author.findById(req.params.id,
    function (err, author) {
      res.render("authors/edit", {author:author});
    });
});

// UPDATE
app.put('/authors/:id', function(req,res){
 db.Author.findByIdAndUpdate(req.params.id, {firstName: req.body.firstName,lastName: req.body.lastName},
     function (err, author) {
       if(err) {
         res.render("authors/edit");
       }
       else {
         res.redirect("/authors");
       }
     });
});

// DESTROY
app.delete('/authors/:id', function(req,res){
  db.Author.findById(req.params.id,
    function (err, author) {
      if(err) {
        console.log(err);
        res.render("authors/show");
      }
      else {
        author.remove();
        res.redirect("/authors");
      }
    });
});

/********* BOOKS ROUTES *********/

// INDEX
app.get('/authors/:author_id/books', function(req,res){
  // db.Author.findById(req.params.author_id,
  //   function (err, author) {
  //     db.Book.find(
  //     {
  //       _id: {$in: author.books}
  //     },
  //     function(err, books){
  //       res.render("books/index", {author:author, books:books});
  //     });
  //   });

  // REFACTOR USING POPULATE
  db.Author.findById(req.params.author_id).populate('books').exec(function(err,author){
    res.render("books/index", {author:author});
  });
});

// NEW
app.get('/authors/:author_id/books/new', function(req,res){
  db.Author.findById(req.params.author_id,
    function (err, author) {
      res.render("books/new", {author:author});
    });
});

// CREATE
app.post('/authors/:author_id/books', function(req,res){
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
app.get('/authors/:author_id/books/:id', function(req,res){
  // db.Author.findById(req.params.author_id,
  //     function (err, author) {
  //       db.Book.findById(req.params.id,
  //       function(err, book){
  //         res.render("books/show", {author:author,book:book});
  //       });
  //     });

  // REFACTOR USING POPULATE
  db.Book.findById(req.params.id)
    .populate('author')
    .exec(function(err,book){
      console.log(book.author)
      res.render("books/show", {book:book});
    });
});

// EDIT
app.get('/authors/:author_id/books/:id/edit', function(req,res){
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
app.put('/authors/:author_id/books/:id', function(req,res){
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
app.delete('/authors/:author_id/books/:id', function(req,res){
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

// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});
