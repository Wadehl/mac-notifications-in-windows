const { join } = require('node:path');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');

// utils
const dayjs = require('dayjs');
const { upload } = require('./utils/uploadImage.js');
const { codeFormatter } = require('./utils/index.js');

app.use(express.json());

const io = new Server(http, {
  cors: {
    origin: '*',
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
  pingInterval: 30000,
  pingTimeout: 50000,
});

io.on('connection', socket => {
  console.log(socket.id);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/postMsg', (req, res) => {
  let code = '';
  if (req.body.type === 'message') {
    code = codeFormatter(req.body.content);
  }
  if (req.body.type === 'low-battery') {
    req.body.type = 'warning';
    req.body.content =
      '【充电警告】你的小iPhone就快没电了！请注意后续充电与时间安排！';
  }
  // 获取当前的时间
  const time = dayjs().format('HH:mm:ss');
  io.emit('showNotificationPopup', { ...req.body, code, time });
  res.json({ code: 200, status: 'success' });
});
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ data: { msg: '请上传图片' }, status: 'failed' });
  }
  const filePath = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({
    status: 'success',
    data: { msg: '图片上传成功', filePath, fileName: req.file.filename },
  });
});

// 定义图片访问路由
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = join(__dirname, 'uploads', filename); // 根据实际路径调整
  res.sendFile(imagePath);
});

http.listen(3000, '0.0.0.0', () => {
  console.log('backendService is listening on port 3000!😎');
});
