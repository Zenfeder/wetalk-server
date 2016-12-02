const UserModel = require('../model/User'),
    PostModel = require('../model/Post');

function SearchClass(params) {
    this.params = params;
}

// 按名称搜索用户列表
SearchClass.prototype.searchUserListByName = function(callback) {
    const _self = this;

    const regex = new RegExp(_self.params.username);

    UserModel.find({
        $and: [{
            username: regex
        }, {
            isActive: 1
        }]
    }, (err, docs) => {
        if (err) {
            callback({
                success: false,
                errorMsg: '按名称搜索用户列表失败',
                errorCode: 432,
                data: null
            });
            return;
        }
        let userList = [];

        for(let i=0;i<docs.length;i++){
            let item = {
                userId: docs[i]._id,
                username: docs[i].username,
                avatar: docs[i].avatar
            };
            userList.push(item);
        }

        callback({
            success: true,
            errorMsg: "按名称搜索用户列表失败成功",
            errorCode: 200,
            data: userList
        });
    });
}

module.exports = SearchClass;