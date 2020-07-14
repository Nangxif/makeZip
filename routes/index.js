var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var JSZip = require("jszip");

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render("index", { title: "Express" });
  // next();
  return;
});
// 生成相对地址文件
router.post("/relativePath", function (req, res, next) {
  const timestamp = new Date().getTime();
  fs.writeFile(
    path.join(__dirname, `../public/relativePath/${timestamp}.txt`),
    JSON.stringify(req.body),
    function (err) {
      if (!err) {
        res.cookie("timestamp", timestamp, {
          //往响应里面去写，所以用res
          path: "/", //放到根目录里面去，而不是子目录
          maxAge: 1000 * 60 * 180, //单位是毫秒*60
        });
        res.json({ timestamp });
      }
    }
  );
  return;
});

// 这个接口仅限于单个单个的文件，如果不做任何处理的话，接口接收到的如果是文件夹，则会把文件夹一层一层拆解，最后生成的文件都在根目录下
router.post("/package", function (req, res, next) {
  // 拿到这个req.cookies.timestamp可以找到相应的文件夹目录格式文件
  var zip = new JSZip();
  // zip创建一个download的文件夹
  var zipFile = zip.folder("download");

  // 拿到目录格式文件并解析
  const catalog = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        `../public/relativePath/${req.cookies.timestamp}.txt`
      )
    )
  );
  // 陆陆续续往download文件夹添加文件
  req.files.forEach((item) => {
    const catalogArray = catalog[item.fieldname].split("/");
    if (catalogArray.length < 2) {
      zipFile.file(
        item.originalname,
        fs.readFileSync(
          path.join(__dirname, "../", item.destination, item.filename)
        ),
        { base64: true }
      );
    } else {
      catalogArray.reduce((zip, v, i) => {
        if (i < catalogArray.length - 1) {
          return zip.folder(v);
        } else {
          return zip.file(
            item.originalname,
            fs.readFileSync(
              path.join(__dirname, "../", item.destination, item.filename)
            ),
            { base64: true }
          );
        }
      }, zipFile);
    }
  });
  zip
    .generateAsync({
      // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
      type: "nodebuffer",
      // 压缩算法
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    })
    .then(function (content) {
      const timestamp = new Date().getTime();
      fs.writeFile(
        path.join(__dirname, `../public/zip/download${timestamp}.zip`),
        content,
        function (err) {
          if (!err) {
            res.json({ filename: `download${timestamp}.zip` });
          }
        }
      );
    });

  return;
});
// 下载接口
router.get("/download", function (req, res, next) {
  res.download(path.join(__dirname, `../public/zip/${req.query.filename}`));
  return;
});

module.exports = router;
