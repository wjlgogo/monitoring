var chokidar = require('chokidar')
var watcher = null
var ready = false

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: '455546148@qq.com',
        pass: 'xxxx' //授权码,通过QQ获取

    }
});
var mailOptions = {
    from: '455546148@qq.com', // 发送者
    to: '455546148@qq.com', // 接受者,可以同时发送多个,以逗号隔开
    subject: 'nodemailer邮件发送', // 标题
    //text: 'Hello world', // 文本
};
var email = function(mailOptions,transporter){
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('发送成功');
    });
}



module.exports.watch = function () {

    // 文件新增时
    function addFileListener(path_) {
        if (ready) {
            console.log('File', path_, 'has been added')
        }
    }
    function addDirecotryListener(path) {
        if (ready) {
            console.log('Directory', path, 'has been added')
        }
    }

    // 文件内容改变时
    function fileChangeListener(path_) {
        console.log('File', path_, 'has been changed')
    }

    // 删除文件时，需要把文件里所有的用例删掉
    function fileRemovedListener(path_) {
        console.log('File', path_, 'has been removed')
    }

    // 删除目录时
    function directoryRemovedListener(path) {
        mailOptions.html='Directory'+path+'has been removed';
        email(mailOptions,transporter);
        console.info('Directory', path, 'has been removed')
    }

    if (!watcher) {
        watcher = chokidar.watch('./pc')
    }
    watcher
        .on('add', addFileListener)
        .on('addDir', addDirecotryListener)
        .on('change', fileChangeListener)
        .on('unlink', fileRemovedListener)
        .on('unlinkDir', directoryRemovedListener)
        .on('error', function (error) {
            console.info('Error happened', error);
        })
        .on('ready', function () {
            console.info('Initial scan complete. Ready for changes.');
            ready = true
        })
}
module.exports.watch();