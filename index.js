const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    upload = require('jquery-file-upload-middleware'),
    crypto = require('crypto');

const router = require('./src/router.js');

app.use(express.static('static'));

app.use(bodyParser.json({
    type: 'application/json'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

// 配置upload中间件
upload.configure({
    uploadDir: __dirname + '/static/uploads', // 上传文件的存储路径
    uploadUrl: '/uploads' // 文件上传请求接口
});
app.use('/upload', upload.fileHandler());
upload.on('begin', function(fileInfo) {
    // 重命名上传的文件
    crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) { console.log(err); }

        fileInfo.name = raw.toString('hex') + path.extname(fileInfo.originalName);
    });
});

router(app, io);

http.listen(3001, function() {
    console.log('服务启动端口号: 3001');
});
