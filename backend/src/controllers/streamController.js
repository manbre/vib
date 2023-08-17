const fs = require("fs");

const location = "E:\\";

const getVideoStream = (req, res) => {
  const fileName = req.params.filename;
  const type = req.params.type;
  let path;
  switch (type) {
    case "trailer":
      path = "vib\\movies\\trailer\\";
      break;
    case "german":
      path = "vib\\movies\\de\\";
      break;
    case "english":
      path = "vib\\movies\\en\\";
      break;

    default:
  }
  const filePath = location + path + fileName;
  if (!filePath) {
    return res.status(404).send("File not found");
  }
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    //206: partial content
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
};

const getImageStream = (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = location + "vib\\movies\\poster\\" + fileName;
    if (!filePath) {
      return res.status(404).send("File not found");
    }
    const head = {
      "Content-Type": "image/jpeg",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getVideoStream,
  getImageStream,
};
