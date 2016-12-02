const UserModel = require('../model/User'),
    PostModel = require('../model/Post'),
    CommentModel = require('../model/Comment'),
    Emailer = require('../emailer'),
    colors = require('colors');

function UserClass(params) {
    this.params = params;
}
// 发送验证码
UserClass.prototype.sendVerifyCode = function(callback) {
    const _self = this;

    const sendCode = function(cb) {
        let fourRandomCode = (parseInt(Math.random() * 10) + '') +
            (parseInt(Math.random() * 10) + '') +
            (parseInt(Math.random() * 10) + '') + 
            (parseInt(Math.random() * 10) + '');

        let email = new Emailer({
            from: "18258209871@163.com",
            to: _self.params.email,
            subject: "WeTalk验证码",
            html: "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<title>weTalk</title>" +
                "<meta charset='utf-8'/>" +
                "</head>" +
                "<body>" +
                "<div class='wrap' style='min-width:960px;margin: auto;'>" +
                "<h3 style='text-align:center;background:#605ca8;color:#fff;padding:10px;margin:0;'>WeTalk</h3>" +
                "<div style='color: #605ca8;background-color: #ecf0f5;min-height: 200px;padding: 10px 40px;margin:0;'>" +
                "<p>Hi, 你的验证码是: " + fourRandomCode + "</p >" +
                "<p> By: 陈果</p >" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>"
        });
        email.send((err, res) => {
            if (err) {
                callback({
                    success: false,
                    errorMsg: "验证码发送失败",
                    errorCode: 410,
                    data: err
                });
                return;
            }

            cb(fourRandomCode);
        });
    }

    UserModel.find({}, (err, users) => {
        if (err) {
            callback({
                success: false,
                errorMsg: "验证码获取失败",
                errorCode: 410,
                data: null
            });
            return;
        }

        let flag = 0;

        for (let i = 0; i < users.length; i++, flag++) {
            if (users[i].email == _self.params.email && users[i].isActive == 1) {
                callback({
                    success: false,
                    errorMsg: "该邮箱已注册",
                    errorCode: 412,
                    data: null
                });
                return;
            }
            if (users[i].email == _self.params.email && users[i].isActive == 0) {
                (function() {
                    sendCode((data) => {
                        users[i].verifyCode = data;
                        users[i].save((err) => {
                            if (err) {
                                callback({
                                    success: false,
                                    errorMsg: "验证码获取失败",
                                    errorCode: 410,
                                    data: null
                                });
                                return;
                            }
                            console.log((_self.params.email + "验证码获取成功").green);

                            callback({
                                success: true,
                                errorMsg: "验证码获取成功",
                                errorCode: 200,
                                data: null
                            });
                        });
                    });
                })();

                return;
            }
        }

        sendCode((data) => {
            let tempUser = new UserModel({
                username: '',
                email: _self.params.email,
                password: '',
                signature: '',
                avatar: '',
                cover: '',
                verifyCode: data,
                isActive: 0,
                status: 0,
                following: [],
                follower: [],
                created_at: '',
                updated_at: ''
            });

            tempUser.save((err) => {
                if (err) {
                    callback({
                        success: false,
                        errorMsg: "验证码获取失败",
                        errorCode: 410,
                        data: null
                    });
                    return;
                }

                console.log((_self.params.email + "验证码获取成功").green);

                callback({
                    success: true,
                    errorMsg: "验证码获取成功",
                    errorCode: 200,
                    data: null
                });
            });
        });
    });
};
// 验证
UserClass.prototype.verify = function(callback) {
    const _self = this;

    UserModel.findOne({
        email: _self.params.email
    }, (err, user) => {
        if (err) {
            callback({
                success: false,
                errorMsg: "验证失败",
                errorCode: 414,
                data: null
            });
            return;
        }

        if (user.verifyCode != _self.params.verifyCode) {
            callback({
                success: false,
                errorMsg: "验证码不正确",
                errorCode: 415,
                data: null
            });
            return;
        }

        console.log((_self.params.email + "验证成功").green);

        callback({
            success: true,
            errorMsg: "验证成功",
            errorCode: 200,
            data: null
        });
    });
};
// 注册
UserClass.prototype.regist = function(callback) {
    const _self = this;

    UserModel.find({}, (err, users) => {
        if (_self.params.username == "陈果") {
            callback({
                success: false,
                errorMsg: '不许用我爸爸的名字',
                errorCode: 413,
                data: null
            });
            return;
        }
        if (users.length == 0) {
            createNewUser();
            return;
        }
        for (let i = 0; i < users.length; i++) {
            if (users[i].username == _self.params.username) {
                callback({
                    success: false,
                    errorMsg: '该用户名已存在',
                    errorCode: 413,
                    data: null
                });
                return;
            }
            // 找到目标
            if (users[i].email == _self.params.email) {
                (function() {
                    users[i].username = _self.params.username;
                    users[i].password = _self.params.password;
                    users[i].avatar = _self.params.avatar;
                    users[i].cover = _self.params.cover;
                    users[i].isActive = 1;
                    users[i].created_at = new Date().getTime();
                    users[i].updated_at = new Date().getTime();

                    users[i].save((err, user) => {
                        if (err) {
                            callback({
                                success: false,
                                errorMsg: "注册失败",
                                errorCode: 410,
                                data: null
                            });
                            return;
                        }

                        console.log(("新用户<" + _self.params.username + ">注册成功").green);

                        callback({
                            success: true,
                            errorMsg: "注册成功",
                            errorCode: 200,
                            data: {
                                userId: user._id
                            }
                        });

                        let email = new Emailer({
                            from: "18258209871@163.com",
                            to: _self.params.email,
                            subject: "WeTalk注册成功",
                            html: "<!DOCTYPE html>" +
                                "<html>" +
                                "<head>" +
                                "<title>weTalk</title>" +
                                "<meta charset='utf-8'/>" +
                                "</head>" +
                                "<body>" +
                                "<div class='wrap' style='min-width:960px;margin: auto;'>" +
                                "<h3 style='text-align:center;background:#605ca8;color:#fff;padding:10px;margin:0;'>WeTalk</h3>" +
                                "<div style='color: #605ca8;background-color: #ecf0f5;min-height: 200px;padding: 10px 40px;margin:0;'>" +
                                "<p>Hi " + _self.params.username + ", 恭喜你注册成功, 欢迎加入weTalk。</p >" +
                                "<p> By: 陈果</p >" +
                                "</div>" +
                                "</div>" +
                                "</body>" +
                                "</html>"
                        });
                        email.send((err, res) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(("新用户<" + _self.params.username + ">注册成功通知邮件发送成功").green);
                        });
                    });
                })();

                return;
            }
        }
    });
};
// 登录
UserClass.prototype.login = function(callback) {
    const _self = this;

    UserModel.findOneAndUpdate({
        $or: [{
            email: _self.params.emailOrUsername
        }, {
            username: _self.params.emailOrUsername
        }]
    }, {
        $set: { status: 1 }
    }, (err, doc) => {
        if (doc == null) {
            callback({
                success: false,
                errorMsg: '用户未注册',
                errorCode: 414,
                data: null
            });
            return;
        } else {
            if ((_self.params.emailOrUsername==doc.email||_self.params.emailOrUsername==doc.username)&&_self.params.password!=doc.password) {
                callback({
                    success: false,
                    errorMsg: '密码不正确',
                    errorCode: 415,
                    data: null
                });
                return;
            }
            if ((_self.params.emailOrUsername==doc.email||_self.params.emailOrUsername==doc.username)&&_self.params.password==doc.password) {
                callback({
                    success: true,
                    errorMsg: "登录成功",
                    errorCode: 200,
                    data: {
                        userId: doc._id,
                        isActive: doc.isActive
                    }
                });
                return;
            } else {
                callback({
                    success: false,
                    errorMsg: "登录失败",
                    errorCode: 416,
                    data: null
                });
                return;
            }
        }
    });
};
// 退出
UserClass.prototype.logout = function(callback) {
    const _self = this;

    UserModel.findByIdAndUpdate(_self.params.userId, {
        $set: {
            status: 0
        }
    }, (err, doc) => {
        if (doc == null) {
            callback({
                success: false,
                errorMsg: '退出失败',
                errorCode: 417,
                data: null
            });
            return;
        } else {
            callback({
                success: true,
                errorMsg: '退出成功',
                errorCode: 200,
                data: null
            });
            return;
        }
    });
};
// 获取个人信息
UserClass.prototype.getProfile = function(callback) {
    const _self = this;

    UserModel.findById(_self.params.userId, (err, doc) => {
        if (err || !doc) {
            callback({
                success: false,
                errorMsg: '个人信息获取失败',
                errorCode: 418,
                data: null
            });
            return;
        } else {
            callback({
                success: true,
                errorMsg: "个人信息获取成功",
                errorCode: 200,
                data: {
                    email: doc.email,
                    userId: doc._id,
                    username: doc.username,
                    signature: doc.signature,
                    avatar: doc.avatar,
                    cover: doc.cover,
                    status: doc.status,
                    isActive: doc.isActive,
                    followingNum: doc.following.length,
                    followerNum: doc.follower.length,
                    created_at: doc.created_at
                }
            });
            return;
        }
    });
};
// 修改个人信息
UserClass.prototype.updateProfile = function(callback) {
    const _self = this;

    // 修改user文档
    const updateUserDoc = function(docUser, cb) {
        // 只需要改 users 集合
        if (_self.params.username == docUser.username && _self.params.avatar == docUser.avatar) {
            UserModel.findByIdAndUpdate(_self.params.userId, {
                $set: {
                    password: _self.params.passwordNew || docUser.password,
                    signature: _self.params.signature || docUser.signature,
                    cover: _self.params.cover || docUser.cover
                }
            }, (err) => {
                if (err) {
                    callback({
                        success: false,
                        errorMsg: '修改失败',
                        errorCode: 430,
                        data: null
                    });
                    return;
                }
                callback({
                    success: true,
                    errorMsg: '修改成功',
                    errorCode: 200,
                    data: null
                });
            });
        }
        // 需要改 posts 集合与comments集合中所有与username、avator相关的信息 
        else {
            // 修改用户的名字和头像
            UserModel.findByIdAndUpdate(_self.params.userId, {
                $set: {
                    username: _self.params.username || docUser.username,
                    password: _self.params.passwordNew || docUser.password,
                    signature: _self.params.signature || docUser.signature,
                    avatar: _self.params.avatar || docUser.avatar,
                    cover: _self.params.cover || docUser.cover
                }
            }, (err) => {
                if (err) {
                    callback({
                        success: false,
                        errorMsg: '修改失败',
                        errorCode: 430,
                        data: null
                    });
                    return;
                }

                cb(docUser);
            });
        }
    };
    // 修改post文档以及内嵌文档
    const updatePost = function(docUser, cb) {
        PostModel.find({}, (err, docs) => {
            if (err) {
                callback({
                    success: false,
                    errorMsg: '修改失败',
                    errorCode: 430,
                    data: null
                });
                return;
            }

            for (let i = 0; i < docs.length; i++) {
                if (docs[i].userId == _self.params.userId) {
                    docs[i].username = _self.params.username || docUser.username;
                    docs[i].avatar = _self.params.avatar || docUser.avatar;
                }

                // 修改点赞
                for (let j = 0; j < docs[i].approves.length; j++) {
                    if (docs[i].approves[j].userId == _self.params.userId) {
                        docs[i].approves[j].username = _self.params.username || docUser.username;
                        docs[i].approves[j].avatar = _self.params.avatar || docUser.avatar;
                    }
                }

                // 修改收藏
                for (let j = 0; j < docs[i].collects.length; j++) {
                    if (docs[i].collects[j].userId == _self.params.userId) {
                        docs[i].collects[j].username = _self.params.username || docUser.username;
                        docs[i].collects[j].avatar = _self.params.avatar || docUser.avatar;
                    }
                }

                // 修改评论
                for (let j = 0; j < docs[i].comments.length; j++) {
                    if (docs[i].comments[j].userId == _self.params.userId) {
                        docs[i].comments[j].username = _self.params.username || docUser.username;
                        docs[i].comments[j].avatar = _self.params.avatar || docUser.avatar;
                    }
                }

                docs[i].save((err, doc) => {
                    if (err) {
                        callback({
                            success: false,
                            errorMsg: '修改失败',
                            errorCode: 430,
                            data: null
                        });
                        return;
                    }
                });
            }

            cb(docUser);
        });
    };

    // 修改comment文档 
    const updateComment = function(docUser) {
        CommentModel.findOneAndUpdate({
            userId: _self.params.userId
        }, {
            $set: {
                username: _self.params.username || docUser.username,
                avatar: _self.params.avatar || docUser.avatar
            }
        }, (err) => {
            if (err) {
                callback({
                    success: false,
                    errorMsg: '修改失败',
                    errorCode: 430,
                    data: null
                });
                return;
            }

            callback({
                success: true,
                errorMsg: '修改成功',
                errorCode: 200,
                data: null
            });
        });
    };

    UserModel.findById(_self.params.userId, (err, docUser) => {
        if (err) {
            callback({
                success: false,
                errorMsg: '修改失败',
                errorCode: 430,
                data: null
            });
            return;
        }

        if (_self.params.passwordOld != docUser.password) {
            callback({
                success: false,
                errorMsg: '权限验证未通过',
                errorCode: 431,
                data: null
            });
        } else {
            updateUserDoc(docUser, (docUser) => {
                updatePost(docUser, (docUser) => {
                    updateComment(docUser);
                });
            });
        }
    });
};

// 根据userId获取用户的个人简介
UserClass.prototype.getUserProfileById = function(callback) {
    const _self = this;

    // 先查询待搜索用户的个人信息
    UserModel.findById(_self.params.userId, (err, doc1) => {
        if (err || !doc1) {
            callback({
                success: false,
                errorMsg: '用户信息获取失败',
                errorCode: 418,
                data: null
            });
            return;
        }
        // 搜索当前发出查询请求的用户的信息，比对看是否已关注
        UserModel.findById(_self.params.userIdLogin, (err, doc2) => {
            if (err || !doc2) {
                callback({
                    success: false,
                    errorMsg: '用户信息获取失败',
                    errorCode: 418,
                    data: null
                });
                return;
            } else {
                let obj = {
                    userId: doc1._id,
                    username: doc1.username,
                    signature: doc1.signature,
                    avatar: doc1.avatar,
                    cover: doc1.cover,
                    status: doc1.status,
                    followingNum: doc1.following.length,
                    followerNum: doc1.follower.length,
                    created_at: doc1.created_at,
                    followed: false
                };
                for (let i = 0; i < doc2.following.length; i++) {
                    if (doc2.following[i] == _self.params.userId) {
                        obj.followed = true;
                        break;
                    }
                }

                callback({
                    success: true,
                    errorMsg: "个人信息获取成功",
                    errorCode: 200,
                    data: obj
                });
                return;
            }
        });
    });
};
// 关注某人
UserClass.prototype.follow = function(callback) {
    const _self = this;

    // 关注者
    UserModel.findById(_self.params.userIdLogin, (err, doc1) => {
        if (err || !doc1) {
            callback({
                success: false,
                errorMsg: '关注失败',
                errorCode: 433,
                data: null
            });
            return;
        }
        doc1.following.push(_self.params.userId);
        doc1.save((err) => {
            // 被关注者
            UserModel.findById(_self.params.userId, (err, doc2) => {
                if (err || !doc2) {
                    callback({
                        success: false,
                        errorMsg: '关注失败',
                        errorCode: 433,
                        data: null
                    });
                    return;
                }

                doc2.follower.push(_self.params.userIdLogin);

                doc2.save((err) => {
                    callback({
                        success: true,
                        errorMsg: '关注成功',
                        errorCode: 200,
                        data: null
                    });
                });
            });
        });
    });
};
// 取消关注
UserClass.prototype.unfollow = function(callback) {
    const _self = this;

    // 取消关注者
    UserModel.findById(_self.params.userIdLogin, (err, doc1) => {
        if (err || !doc1) {
            callback({
                success: false,
                errorMsg: '取消关注失败',
                errorCode: 433,
                data: null
            });
            return;
        }

        for (let i = 0; i < doc1.following.length; i++) {
            if (doc1.following[i] == _self.params.userId) {
                doc1.following.splice(i, 1);
                break;
            }
        }

        doc1.save((err) => {
            // 被取消关注者
            UserModel.findById(_self.params.userId, (err, doc2) => {
                if (err || !doc2) {
                    callback({
                        success: false,
                        errorMsg: '取消关注失败',
                        errorCode: 433,
                        data: null
                    });
                    return;
                }

                for (let i = 0; i < doc2.follower.length; i++) {
                    if (doc2.follower[i] == _self.params.userIdLogin) {
                        doc2.follower.splice(i, 1);
                        break;
                    }
                }

                doc2.save((err) => {
                    callback({
                        success: true,
                        errorMsg: '取消关注成功',
                        errorCode: 200,
                        data: null
                    });
                });
            });
        });
    });
};
// 获取关注列表
UserClass.prototype.getFollowingList = function(callback) {
    const _self = this;

    UserModel.findById(_self.params.userId, (err, doc) => {
        if (err) {
            callback({
                success: false,
                errorMsg: '获取关注列表失败',
                errorCode: 434,
                data: null
            });
            return;
        }

        const followingIdList = doc.following;

        UserModel.find({
            "_id": {
                $in: followingIdList
            }
        }, (err, docs) => {
            if (err) {
                callback({
                    success: false,
                    errorMsg: '获取关注列表失败',
                    errorCode: 434,
                    data: null
                });
                return;
            }

            let followingProfileList = [];

            for (let i = 0; i < docs.length; i++) {
                let item = {
                    userId: docs[i]._id,
                    username: docs[i].username,
                    signature: docs[i].signature,
                    avatar: docs[i].avatar,
                    cover: docs[i].cover,
                    followingNum: docs[i].following.length,
                    followerNum: docs[i].follower.length
                };

                followingProfileList.push(item);
            }

            callback({
                success: true,
                errorMsg: '获取关注列表成功',
                errorCode: 200,
                data: followingProfileList
            });
        });
    })
};
// 获取粉丝列表
UserClass.prototype.getFollowerList = function(callback) {
    const _self = this;

    UserModel.findById(_self.params.userIdLogin, (err, userLogin) => {
        if (err) {
            callback({
                success: false,
                errorMsg: '获取粉丝列表失败',
                errorCode: 435,
                data: null
            });
            return;
        }

        // 查询需获取粉丝列表的用户
        UserModel.findById(_self.params.userId, (err, doc) => {
            if (err) {
                callback({
                    success: false,
                    errorMsg: '获取粉丝列表失败',
                    errorCode: 435,
                    data: null
                });
                return;
            }

            const followerIdList = doc.follower;

            // 按粉丝id获取粉丝的其他信息
            UserModel.find({
                "_id": {
                    $in: followerIdList
                }
            }, (err, docs) => {
                if (err) {
                    callback({
                        success: false,
                        errorMsg: '获取粉丝列表失败',
                        errorCode: 435,
                        data: null
                    });
                    return;
                }

                let followerProfileList = [];

                for (let i = 0; i < docs.length; i++) {
                    let item = {
                        userId: docs[i]._id,
                        username: docs[i].username,
                        signature: docs[i].signature,
                        avatar: docs[i].avatar,
                        cover: docs[i].cover,
                        followingNum: docs[i].following.length,
                        followerNum: docs[i].follower.length,
                        followed: false
                    };

                    for (let j = 0; j < userLogin.following.length; j++) {
                        if (docs[i]._id == userLogin.following[j]) {
                            item.followed = true;
                            break;
                        }
                    }

                    followerProfileList.push(item);
                }

                callback({
                    success: true,
                    errorMsg: '获取粉丝列表成功',
                    errorCode: 200,
                    data: followerProfileList
                });
            });
        })
    });
};

module.exports = UserClass;
