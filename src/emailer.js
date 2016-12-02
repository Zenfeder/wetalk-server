const config = require('../config/config'),
    nodemailer = require('nodemailer');

//配置邮件
const transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    secureConnection: false,
    port:465,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
	tls: {
		rejectUnauthorized: false
	}
});

function Emailer (params) {
    this.option = {};

    if(!params.from){
        console.error("请填写邮件发送方的邮件地址");
        return;
    }
    if(!params.to){
        console.error("请填写邮件接收方的邮件地址");
        return;
    }

    this.option.from = params.from; // 发送者邮件地址
    this.option.to = params.to; // 接收方邮件地址（多个之间以逗号隔开即可）
    this.option.subject = params.subject || ''; // 邮件主题
    this.option.text = params.text || '';
    this.option.html = params.html || '';
}

Emailer.prototype.send = function (callback) {
    const _self = this;

    transporter.sendMail(_self.option, function(err, res){
        callback(err, res);
    });
}

module.exports = Emailer;



