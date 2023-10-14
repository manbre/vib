const fs = require("fs");

const moviesDir = "G:\\vib\\movies\\";
const episodesDir = "G:\\vib\\show\\";

/**
 * @req type, media (teaser / german / english), filename
 * @res -
 */
const getVideoStream = (req, res) => {
  let dir;
  switch (req.params.type) {
    case 1:
      dir = moviesDir;
      break;
    case 2:
      dir = episodesDir;
      break;
    default:
  }
  //
  let path;
  switch (req.params.media) {
    case "teaser":
      path = "\\teaser\\";
      break;
    case "german":
      path = "\\de\\";
      break;
    case "english":
      path = "\\en\\";
      break;
    default:
  }
  const filePath = dir + path + req.params.filename;
  if (!filePath) {
    res.status(404).send("File not found");
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

/**
 * @req type, filename
 * @res -
 */
const getImageStream = (req, res) => {
  let dir;
  switch (req.params.type) {
    case 1:
      dir = moviesDir;
      break;
    case 2:
      dir = episodesDir;
      break;
    default:
  }
  //
  const filePath = dir + "\\poster\\" + req.params.filename;
  if (!filePath) {
    res.status(404).send("File not found");
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

/**
 * @req filename
 * @res -
 */
const getAudioStream = (req, res) => {
  const filePath = episodesDir + "//teaser//" + req.params.filename;
  if (!filePath) {
    res.status(404).send("File not found");
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
