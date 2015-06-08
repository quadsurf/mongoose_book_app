var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require('method-override'),
morgan = require("morgan")
db = require("./models"),
authors = require('./controllers/authors'),
books = require('./controllers/books');


app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));

app.use('/authors', authors);
app.use('/authors/:author_id/books', books);

// ROOT
app.get('/', function(req,res){
  res.redirect("/authors");
});

// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});
