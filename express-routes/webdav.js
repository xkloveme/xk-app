import { createClient } from "webdav";

const client = createClient("http://localhost:15244/dav", {
  username: "mac",
  password: "mac"
});

export const webdavList = async function (req, res) {
  const { path } = req.query;
  let directoryItems = await client.getDirectoryContents(path || "/");
  res.status(200).json(directoryItems);
};

export const webdavGetText = async function (req, res) {
  const { path } = req.query;
  const str = await client.getFileContents(path, { format: "text" })
  res.status(200).json(str);
};

export const webdavPutText = async function (req, res) {
  const { path, content } = req.body;
  const str = await client.putFileContents(path, content)
  res.status(200).json(str);;
};

;