var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');
var config = {
    // 文件根目录
    dir:"C:/objs/ariport/"
}

/**
 * 把mtl文件和obj文件打包成zip压缩包
 * @param  {} fileName 不带文件后缀的文件名
 * @param  {} {delSource = false } = {} 是否删除源文件
 */
function toZipOfMtlObj (fileName, { delSource = false } = {}) {
    var zip = new JSZip();
    var extArr = ['.mtl', '.obj'];

    extArr.forEach(ext => {
        let file = fileName + ext;
        let content = getFileContent(fileName + ext);
        zip.file(file, content);
    })

    // 压缩
    zip.generateAsync({
        // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
        type: "nodebuffer",
        // 压缩算法
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        let zip = fileName + '.zip';
        // 写入磁盘
        fs.writeFile(getFullFileName(zip), content, function (err) {
            if (!err) {
                // 是否删除源文件
                if (delSource) {
                    extArr.forEach(ext => {
                        delFile(fileName + ext);
                    })
                }
            } else {
                console.log(zip + '压缩失败');
            }
        });
    });
}