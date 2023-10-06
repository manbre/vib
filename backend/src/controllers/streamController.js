const fs = require("fs");

const location = "G:\\";

const getVideoStream = (req, res) => {
  const fileName = req.params.filename;
  const type = req.params.type;
  let path;
  switch (type) {
    case "trailer":
      path = "vib\\movies\\teaser\\";
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
      "Content-Type": "media-type",
    };
    //206: partial content
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "media-type",
    };
    res.writeHead(200, head);
    const readstream = fs.createReadStream(filePath);
    readstream.on("open", () => {
      readstream.pipe(res);
    });
    readstream.on("error", (err) => {
      res.end(err);
    });
  }
};

const getImageStream = (req, res) => {
  const fileName = req.params.filename;
  const filePath = location + "vib\\movies\\poster\\" + fileName;
  if (!filePath) {
    return res.status(404).send("File not found");
  }
  const head = {
    "Content-Type": "image/jpeg",
  };
  res.writeHead(200, head);
  const readstream = fs.createReadStream(filePath);
  readstream.on("open", () => {
    readstream.pipe(res);
  });
  readstream.on("error", (err) => {
    res.end(err);
  });
};

const getAudioStream = (req, res) => {
  const fileName = req.params.filename;
  let path = "vib\\shows\\";
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
      "Content-Type": "audio/mp3",
    };
    //206: partial content
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "audio/mp3",
    };
    res.writeHead(200, head);
    const readstream = fs.createReadStream(filePath);
    readstream.on("open", () => {
      readstream.pipe(res);
    });
    readstream.on("error", (err) => {
      res.end(err);
    });
  }
};

module.exports = {
  getVideoStream,
  getImageStream,
  getAudioStream,
};
