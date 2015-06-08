var mongoose = require("mongoose");
var Book = require("./book");

var authorSchema = new mongoose.Schema({
                    firstName: String,
                    lastName: String,
                    books: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Book"
                    }]
                  });


authorSchema.pre('remove', function(callback) {
    Book.remove({author_id: this._id}).exec();
    callback();
});

var Author = mongoose.model("Author", authorSchema);

module.exports = Author;