import express from "express";
import { getTree } from './notes.js';
import { webdavList, webdavGetText, webdavPutText } from './webdav.js';

// const config = require('./config');
// const chatgpt = require('./chatapt');
// const notes = require('./notes');
// const terminal = require('./terminal');
const router = express.Router();

router.get("/status", function (req, res) {
  let responseObject = {};
  responseObject.status = "OK";
  responseObject.statusCode = 200;
  res.json(responseObject);
});
// config
// router.get('/getJson', config.getJson);
// router.get('/pwdCheck', config.pwdCheck);
// router.get('/config', config.config);
// // ai
// router.post('/chatgpt', chatgpt);
// note
router.get('/notes/tree', getTree);
// 获取webdav 列表
router.get('/webdav/list', webdavList);
router.get('/webdav/getText', webdavGetText);
router.post('/webdav/putText', webdavPutText);
// terminal
// router.get('/cmd', terminal.cmd);
// // translate
// router.get('/translate', terminal.translate);

export default router;
