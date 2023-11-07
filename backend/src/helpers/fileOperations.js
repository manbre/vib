const https = require("https");
const fs = require("fs");

/**
 * @param fileSource
 * @param newFolder
 * @param newPath
 */
const copyFile = async (fileSource, newFolder, newPath) => {
  if (fileSource) {
    //create "dir" if not exists, "recursive: true" => for parent folder too
    !fs.existsSync(newFolder) && fs.mkdirSync(newFolder, { recursive: true });
    //download poster from web (e.g. OMDB api) to location
    if (fileSource.includes("http")) {
      https.get(fileSource, (response) => {
        let file = fs.createWriteStream(newPath);
        response.pipe(file);
        file.on("error", (err) => {
          console.log(err);
        });
        file.on("finish", () => {
          file.close();
        });
      });
    } else {
      //copy local file to location
      fs.copyFile(fileSource, newPath, (err) => {
        console.log({ error: err.message });
      });
    }
  }
};

/**
 * @param fileLocation
 */
const deleteFile = (fileLocation) => {
    fs.existsSync(fileLocation) &&
      fs.rm(fileLocation, (err) => {
        console.log({ error: err.message });
      });
  };

module.exports = {
  copyFile,
  deleteFile,
};