const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

class episodeModel extends Model {}

episodeModel.init(
  {
    title: { type: DataTypes.TEXT }, //title of episode
    //
    episodeNr: { type: DataTypes.INTEGER },
    runtime: { type: DataTypes.INTEGER },
    //
    plot: { type: DataTypes.TEXT },
    //
    german: { type: DataTypes.TEXT }, //name of german .mp4 file
    english: { type: DataTypes.TEXT }, //name of english .mp4 file
    //
    seasonId: { type: DataTypes.INTEGER }, //"id" of season in seasonModel
    //
    elapsedTime: { type: DataTypes.INTEGER, defaultValue: 0 },
    lastWatched: { type: DataTypes.DATE },
  },

  {
    sequelize,
    modelName: "Episodes",
    timestamps: false,
  }
);

module.exports = episodeModel;
