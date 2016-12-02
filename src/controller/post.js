const PostModel = require('../model/Post'),
	CommentModel = require('../model/Comment'),
	UserModel = require('../model/User');

function PostClass (params) {
	this.params = params;
}

// 获取所有文章列表
PostClass.prototype.getAllPostList = function (callback) {
	const _self = this;

	PostModel.find({}, (err, docs) => {
		if (err) {
			callback({
                success: false,
                errorMsg: '文章列表获取失败',
                errorCode: 419,
                data: null
            });
            return;
		}

		callback({
            success: true,
            errorMsg: '文章列表获取成功',
            errorCode: 200,
            data: docs
        });		
	}).sort({created_at: -1});
}
// 获取关注的人以及自己的文章列表
PostClass.prototype.getFollowingPostList = function (callback) {
	const _self = this;

	UserModel.findById(_self.params.userId, (err, user)=>{
		if (err) {
			callback({
                success: false,
                errorMsg: '文章列表获取失败',
                errorCode: 419,
                data: null
            });
            return;
		}

		let userIdList = user.following;
		userIdList.push(_self.params.userId);

		PostModel.find({ 
			userId: { $in:  userIdList} 
		}, (err, docs) => {
			if (err) {
				callback({
	                success: false,
	                errorMsg: '文章列表获取失败',
	                errorCode: 419,
	                data: null
	            });
	            return;
			}

			callback({
	            success: true,
	            errorMsg: '文章列表获取成功',
	            errorCode: 200,
	            data: docs
	        });		
		}).sort({created_at: -1});
	});
}
// 按userId获取文章列表
PostClass.prototype.getPostListByUserId = function (callback) {
	const _self = this;

	PostModel.find({
		userId: _self.params.userId
	}, (err, docs) => {
		if (err) {
			callback({
                success: false,
                errorMsg: '文章列表获取失败',
                errorCode: 419,
                data: null
            });
            return;
		}

		callback({
            success: true,
            errorMsg: '文章列表获取成功',
            errorCode: 200,
            data: docs
        });		
	}).sort({created_at: -1});
}
// 获取我发布的文章列表
PostClass.prototype.getMyPostList = function (callback) {
	const _self = this;

	PostModel.find({
		userId: _self.params.userId
	}, (err, docs) => {
		if (err) {
			callback({
                success: false,
                errorMsg: '我的文章列表获取失败',
                errorCode: 420,
                data: null
            });
            return;
		}
		callback({
            success: true,
            errorMsg: '我的文章列表获取成功',
            errorCode: 200,
            data: docs
        });
	}).sort({updated_at: -1});	
}
// 发布文章
PostClass.prototype.publishPost = function (callback) {
	const _self = this;

    UserModel.findById(_self.params.userId, (err, docUser) => {
    	if (err) {
    		callback({
	            success: false,
	            errorMsg: "发布失败",
	            errorCode: 421,
	            data: null
	        });
	        return;
    	}

    	let newPost = new PostModel({
	        userId : _self.params.userId,
			username: docUser.username,
			avatar: docUser.avatar,
		    content : _self.params.content,
		    photos : _self.params.photos,
		    comments : [],
		    approves : [],
		    collects : [],
		    created_at : new Date().getTime(),
		    updated_at : new Date().getTime(),
	    });

	    newPost.save((err, doc) => {
			if(err) {
				callback({
		            success: false,
		            errorMsg: "发布失败",
		            errorCode: 421,
		            data: null
		        });
		        return;
			}
			callback({
	            success: true,
	            errorMsg: "发布成功",
	            errorCode: 200,
	            data: null
	        });
		});
    });
}
// 删除我的某篇文章
PostClass.prototype.removeOnePost = function (callback) {
	const _self = this;

	PostModel.findByIdAndRemove(_self.params.postId, (err, doc) => {
		if(err) {
			callback({
	            success: false,
	            errorMsg: "删除失败",
	            errorCode: 422,
	            data: null
	        });
	        return;
		}

		callback({
            success: true,
            errorMsg: "删除成功",
            errorCode: 200,
            data: null
        });
        
		CommentModel.find({
			postId: _self.params.postId
		}, (err, docs) => {
			for(let i=0;i<docs.length;i++){
				docs[i].remove((err, comment) => {
				});
			}
		});
	});
}
// 给文章点赞
PostClass.prototype.approvePost = function (callback) {
	const _self = this;

	UserModel.findById(_self.params.userId, (err, docUser) => {
    	if (err) {
    		callback({
	            success: false,
	            errorMsg: "点赞失败",
	            errorCode: 423,
	            data: null
	        });
	        return;
    	}

    	PostModel.findByIdAndUpdate(_self.params.postId, {
        	$push: {
        		approves: {
        			userId: _self.params.userId,
        			username: docUser.username,
        			avatar: docUser.avatar
        		}
        	}
        }, (err, doc) => {
        	if(err) {
				callback({
		            success: false,
		            errorMsg: "点赞失败",
		            errorCode: 423,
		            data: null
		        });
		        return;
			}
			callback({
	            success: true,
	            errorMsg: "点赞成功",
	            errorCode: 200,
	            data: null
	        });
    	});
    });
}
// 取消点赞
PostClass.prototype.disapprovePost = function (callback) {
	const _self = this;

	PostModel.findByIdAndUpdate(_self.params.postId, {
    	$pull: {
    		approves: {
    			userId: _self.params.userId
    		}
    	}
    }, (err, doc) => {
    	if(err) {
			callback({
	            success: false,
	            errorMsg: "取消失败",
	            errorCode: 424,
	            data: null
	        });
	        return;
		}
		callback({
            success: true,
            errorMsg: "取消成功",
            errorCode: 200,
            data: null
        });
	});
}
// 收藏文章
PostClass.prototype.collectPost = function (callback) {
	const _self = this;

	UserModel.findById(_self.params.userId, (err, docUser) => {
    	if (err) {
    		callback({
	            success: false,
	            errorMsg: "收藏失败",
	            errorCode: 425,
	            data: null
	        });
	        return;
    	}

    	PostModel.findByIdAndUpdate(_self.params.postId, {
        	$push: {
        		collects: {
        			userId: _self.params.userId,
        			username: docUser.username,
        			avatar: docUser.avatar
        		}
        	}
        }, (err, doc) => {
        	if(err) {
				callback({
		            success: false,
		            errorMsg: "收藏失败",
		            errorCode: 425,
		            data: null
		        });
		        return;
			}
			callback({
	            success: true,
	            errorMsg: "收藏成功",
	            errorCode: 200,
	            data: null
	        });
    	});
    });
}
// 取消收藏 && 将文章移出收藏夹
PostClass.prototype.discollectPost = function (callback) {
	const _self = this;

	PostModel.findByIdAndUpdate(_self.params.postId, {
    	$pull: {
    		collects: {
    			userId: _self.params.userId
    		}
    	}
    }, (err, docPost) => {
    	if(err) {
			callback({
	            success: false,
	            errorMsg: "取消收藏失败",
	            errorCode: 426,
	            data: null
	        });
	        return;
		}
		UserModel.findByIdAndUpdate(_self.params.userId, {
	    	$pull: {
	    		collects: {
	    			postId: _self.params.postId
	    		}
	    	}
	    }, (err, docUser) => {
	    	if(err) {
				callback({
		            success: false,
		            errorMsg: "取消收藏失败",
		            errorCode: 426,
		            data: null
		        });
		        return;
			}
			callback({
	            success: true,
	            errorMsg: "取消收藏成功",
	            errorCode: 200,
	            data: null
	        });
		});
		
	});
}
// 获取收藏过的文章列表
PostClass.prototype.getCollectionList = function (callback) {
	const _self = this;

	PostModel.find({
		'collects.userId': _self.params.userId
	}, (err, docs) => {
		if(err) {
			callback({
	            success: false,
	            errorMsg: "获取收藏列表失败",
	            errorCode: 427,
	            data: null
	        });
	        return;
		}
		callback({
            success: true,
            errorMsg: "获取收藏列表成功",
            errorCode: 200,
            data: docs
        });
	}).sort({created_at: -1});
}
// 评论文章
PostClass.prototype.commentPost = function (callback) {
	const _self = this;

	let comment = new CommentModel({
		postId: _self.params.postId,
		userId: _self.params.comment.userId,
		username: _self.params.comment.username,
		avatar: _self.params.comment.avatar,
		content: _self.params.comment.content,
		created_at: new Date().getTime()
	});

	comment.save((err, docComment) => {
		if(err) {
			callback({
	            success: false,
	            errorMsg: "评论失败",
	            errorCode: 428,
	            data: null
	        });
	        return;
		}

		PostModel.findByIdAndUpdate(_self.params.postId, {
			$push: {
	    		comments: {
	    			commentId: docComment._id,
	    			userId: docComment.userId,
	    			username: docComment.username,
	    			avatar: docComment.avatar,
	    			content: docComment.content,
	    			created_at: docComment.created_at
	    		}
	    	}
		}, (err) => {
			if(err) {
				callback({
		            success: false,
		            errorMsg: "评论失败",
		            errorCode: 428,
		            data: null
		        });
		        return;
			}
			callback({
	            success: true,
	            errorMsg: "评论成功",
	            errorCode: 200,
	            data: {
	            	commentId: docComment._id,
	    			userId: docComment.userId,
	    			username: docComment.username,
	    			avatar: docComment.avatar,
	    			content: docComment.content,
	    			created_at: docComment.created_at
	            }
	        });
		});
	});
}
// 删除评论
PostClass.prototype.removeOneComment = function (callback) {
	const _self = this;

	CommentModel.findByIdAndRemove(_self.params.commentId, (err, docComment) => {
		if(err) {
			callback({
	            success: false,
	            errorMsg: "删除失败",
	            errorCode: 429,
	            data: null
	        });
	        return;
		}

		PostModel.findByIdAndUpdate(_self.params.postId, {
			$pull: {
	    		comments: {
	    			commentId: _self.params.commentId
	    		}
	    	}
		}, (err, doc) => {
			if(err) {
				callback({
		            success: false,
		            errorMsg: "删除失败",
		            errorCode: 429,
		            data: null
		        });
		        return;
			}
			callback({
	            success: true,
	            errorMsg: "删除成功",
	            errorCode: 200,
	            data: null
	        });
		});
	});
}

module.exports = PostClass;
