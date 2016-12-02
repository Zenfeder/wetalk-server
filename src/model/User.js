const mongoose = require('../db_mongoose');

const Schema = mongoose.Schema;

// create a schema
const userSchema = new Schema({
	username: String,
	password: String,
	email: { type: String, required: true },
	verifyCode: String, // 验证码
	isActive: Number, // 是否已激活(0:验证成功; 1:验证失败)
	status: Number,  // 用户状态(0:离线; 1:在线)
	avatar: String,
	cover: String,
	signature: String,
	collections: [{ postId: String, _id : false }],
	following: { type: [String], _id : false },
	follower: { type: [String], _id : false },

	created_at: String,
	updated_at: String
},{ 
	versionKey: false 
});

const User = mongoose.model('User', userSchema);

module.exports = User;

