const mongoose = require('../db_mongoose');

const Schema = mongoose.Schema;

// create a schema
const commentSchema = new Schema({
    postId: String,
    userId : String,
    username: String,
    avatar: String,
    content : String,
    created_at: String
},{ 
    versionKey: false 
});

// create a model to use schema
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

