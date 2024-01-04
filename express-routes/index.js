import express from "express";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const config = require('./config');
const chatgpt = require('./chatapt');
const notes = require('./notes');
const terminal = require('./terminal');
const router = express.Router();

router.get("/status", function (req, res) {
  let responseObject = {};
  responseObject.status = "OK";
  responseObject.statusCode = 200;
  res.json(responseObject);
});
// config
router.get('/getJson', config.getJson);
router.get('/pwdCheck', config.pwdCheck);
router.get('/config', config.config);
// ai
router.post('/chatgpt', chatgpt);
// note
router.get('/notes/tree', notes.getTree);
// terminal
router.get('/cmd', terminal.cmd);
// translate
router.get('/translate', terminal.translate);

export default router;
