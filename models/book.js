var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
                    title: String,
                    description: String,
                    author: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Author"
                    }
                  });


var Book = mongoose.model("Book", bookSchema);

module.exports = Book;