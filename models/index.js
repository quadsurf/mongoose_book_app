var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/book_app_with_author");

module.exports.Book = require("./book");
module.exports.Author = require("./author");