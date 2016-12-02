const config = require('../config/config'),
    User = require('./controller/user'),
    Post = require('./controller/post'),
    Search = require('./controller/search');

module.exports = (app, io) => {
    // 发送验证码
    app.post('/user/sendVerifyCode', (req, res) => {
        var user = new User({
            email: req.body.email
        });
        user.sendVerifyCode((data) => {
            res.json(data);
            res.end();
        });
    });
    // 验证
    app.post('/user/verify', (req, res) => {
        var user = new User({
            email: req.body.email,
            verifyCode: req.body.verifyCode
        });
        user.verify((data) => {
            res.json(data);
            res.end();
        });
    });
    // 注册
    app.post('/user/regist', (req, res) => {
        var user = new User(req.body);
        user.regist((data) => {
            if(data.success){
                res.cookie('userId', data.data.userId, {domain: config.domain});
            }
            res.json(data);
            res.end();
        });
    });
    // 登录
    app.post('/user/login', (req, res) => {
        var user = new User(req.body);
        user.login((data) => {
            if(data.success){
                res.cookie('userId', data.data.userId, {domain: config.domain});
            }
            res.json(data);
            res.end();
        });
    });
    // 退出
    app.post('/user/logout', (req, res) => {
        var user = new User({
            userId: req.cookies.userId
        });
        user.logout((data) => {
            if(data.success){
                res.clearCookie('userId', {domain: config.domain});
            }
            res.json(data);
            res.end();
        });
    });
    // 获取当前登录用户的基本信息
    app.get('/user/profile', (req, res) => {
        var user = new User({
            userId: req.cookies.userId
        });
        user.getProfile((data) => {
            res.json(data);
            res.end();
        });
    });
    // 根据userId获取用户的基本信息
    app.post('/user/profile/by/userId', (req, res) => {
        var user = new User({
            userIdLogin: req.cookies.userId,
            userId: req.body.userId
        });
        user.getUserProfileById((data) => {
            res.json(data);
            res.end();
        });
    });
    // 关注某人
    app.post('/user/follow', (req, res) => {
        var user = new User({
            userIdLogin: req.cookies.userId,
            userId: req.body.userId
        });
        user.follow((data) => {
            res.json(data);
            res.end();
        });
    });
    // 取消关注
    app.post('/user/unfollow', (req, res) => {
        var user = new User({
            userIdLogin: req.cookies.userId,
            userId: req.body.userId
        });
        user.unfollow((data) => {
            res.json(data);
            res.end();
        });
    });
    // 获取关注列表
    app.post('/user/getFollowingList', (req, res) => {
        var user = new User({
            userId: req.body.userId
        });
        user.getFollowingList((data) => {
            res.json(data);
            res.end();
        });
    });
    // 获取粉丝列表
    app.post('/user/getFollowerList', (req, res) => {
        var user = new User({
            userIdLogin: req.cookies.userId,
            userId: req.body.userId
        });
        user.getFollowerList((data) => {
            res.json(data);
            res.end();
        });
    });

    // 修改个人信息
    app.post('/user/setting', (req, res) => {
        var user = new User({
            userId: req.cookies.userId,
            username: req.body.username,
            passwordNew: req.body.passwordNew,
            passwordOld: req.body.passwordOld,
            signature: req.body.signature,
            avatar: req.body.avatar,
            cover: req.body.cover
        });
        user.updateProfile((data) => {
            res.json(data);
            res.end();
        });
    });

    // 发布文章
    app.post('/post/publish', (req, res) => {
        var post = new Post({
            userId: req.cookies.userId,
            content: req.body.content,
            photos: req.body.photos
        });

        post.publishPost((data) => {
            res.json(data);
            res.end();
        });
    });

    // 获取所有文章列表
    app.post('/post/all/list', (req, res) => {
        var post = new Post({
            userId: req.cookies.userId,
        });

        post.getAllPostList((data) => {
            res.json(data);
            res.end();
        });
    });
    //  获取关注的人的文章列表
    app.post('/post/following/list', (req, res) => {
        var post = new Post({
            userId: req.cookies.userId,
        });

        post.getFollowingPostList((data) => {
            res.json(data);
            res.end();
        });
    });
    // 按userId获取文章列表
    app.post('/post/list/by/userId', (req, res) => {
        var post = new Post({
            userId: req.body.userId,
        });

        post.getPostListByUserId((data) => {
            res.json(data);
            res.end();
        });
    });
    // 获取我的文章列表
    app.post('/post/my/list', (req, res) => {
        var post = new Post({
            userId: req.cookies.userId,
        });

        post.getMyPostList((data) => {
            res.json(data);
            res.end();
        });
    });
    // 删除文章
    app.post('/post/remove', (req, res) => {
        var post = new Post({
            postId: req.body.postId,
        });

        post.removeOnePost((data) => {
            res.json(data);
            res.end();
        });
    });

    // 点赞
    app.post('/post/approve', (req, res) => {
        var post = new Post({
            postId: req.body.postId,
            userId: req.cookies.userId,
            username: req.body.username,
            avatar: req.body.avatar
        });

        post.approvePost((data) => {
            res.json(data);
            res.end();
        });
    });
    // 取消点赞
    app.post('/post/disapprove', (req, res) => {
        var post = new Post({
            postId: req.body.postId,
            userId: req.cookies.userId,
        });

        post.disapprovePost((data) => {
            res.json(data);
            res.end();
        });
    });
    // 收藏文章
    app.post('/post/collect', (req, res) => {
        var post = new Post({
            postId: req.body.postId,
            userId: req.cookies.userId,
            username: req.body.username,
            avatar: req.body.avatar
        });

        post.collectPost((data) => {
            res.json(data);
            res.end();
        });
    });
    // 取消收藏
    app.post('/post/discollect', (req, res) => {
        var post = new Post({
            postId: req.body.postId,
            userId: req.cookies.userId
        });

        post.discollectPost((data) => {
            res.json(data);
            res.end();
        });
    });
    // 获取登录者的收藏列表
    app.post('/post/collected/list', (req, res) => {
        var post = new Post({
            userId: req.cookies.userId,
        });

        post.getCollectionList((data) => {
            res.json(data);
            res.end();
        });
    });
    // 评论文章
    app.post('/post/comment', (req, res) => {
        var post = new Post({
            postId: req.body.postId,
            comment: {
                userId : req.cookies.userId,
                username : req.body.comment.username,
                avatar : req.body.comment.avatar,
                content : req.body.comment.content
            }
        });

        post.commentPost((data) => {
            res.json(data);
            res.end();
        });
    });
    // 删除评论
    app.post('/post/delComment', (req, res) => {
        if(req.body.userId !== req.cookies.userId){
            res.json({
                data: null,
                errorMsg: "你没有删除权限",
                errorCode: 446,
                success: false
            });
            res.end();
        }else{
            let post = new Post({
                postId: req.body.postId,
                commentId: req.body.commentId
            });

            post.removeOneComment((data) => {
                res.json(data);
                res.end();
            });
        }
    });
    // 按名称搜索用户列表
    app.post('/search/userListByName', (req, res) => {
        let search = new Search({ 
            userIdLogin: req.cookies.userId,
            username: req.body.username 
        });
        search.searchUserListByName((data) => {
            res.json(data);
            res.end();
        });
    });

    
    // io.on('connection', (socket) => {
    //     console.log('Socket connect successful.');

    //     socket.emit('serverEmit', "I'm a message from server.");

    //     socket.on('clientEmit', (msg) => {
    //         console.log("客户端来信: " + msg);
    //     });
    // });
};
