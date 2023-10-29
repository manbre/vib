const fs = require("fs");

/**
 * @param fileLocation
 */
export const deleteFile = (fileLocation) => {
  fs.existsSync(fileLocation) &&
    fs.rm(fileLocation, (err) => {
      console.log({ error: err.message });
    });
};
