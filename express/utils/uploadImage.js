const multer = require('multer');

// 配置 Multer 来处理上传的文件
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'express/uploads/'); // 文件保存路径
  },
  filename: function (req, file, cb) {
    cb(null, `Image-${Date.now()}.${file.originalname.split('.')[1]}`); // 设置文件名
  },
});

const upload = multer({ storage: storage });

exports.upload = upload;
