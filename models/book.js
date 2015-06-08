var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
                    title: String,
                    author: String,
                    description: String,
                    author_id: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Author"
                    }
                  });


var Book = mongoose.model("Book", bookSchema);

module.exports = Book;