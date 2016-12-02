const mongoose = require('../db_mongoose');

const Schema = mongoose.Schema;

// create a schema
const postSchema = new Schema({
    userId: String,
    username: String,
    avatar: String,
    content: String,
    photos: [{ type: String, _id: false }],
    comments: [{
        commentId: String,
        userId: String,
        username: String,
        avatar: String,
        content: String,
        created_at: String
    }],
    approves: [{
        userId: String,
        username: String,
        avatar: String,
    }, {
        _id: false
    }],
    collects: [{
        userId: String,
        username: String,
        avatar: String,
    }, {
        _id: false
    }],
    created_at: String,
    updated_at: String
}, {
    versionKey: false
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
