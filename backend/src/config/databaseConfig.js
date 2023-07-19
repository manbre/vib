const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("video-db", "user", "pass", {
  dialect: "sqlite",
  host: "./vib.db",
});

module.exports = sequelize;
