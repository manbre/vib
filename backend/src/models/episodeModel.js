const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

class episodeModel extends Model {}

episodeModel.init(
  {
    series: { type: DataTypes.TEXT }, //title of whole series
    title: { type: DataTypes.TEXT }, //title of episode
    director: { type: DataTypes.TEXT },
    genre: { type: DataTypes.TEXT },
    //
    year: { type: DataTypes.INTEGER },
    fsk: { type: DataTypes.INTEGER }, //self regulatory
    season: { type: DataTypes.INTEGER },
    episode: { type: DataTypes.INTEGER },
    runtime: { type: DataTypes.INTEGER },
    //
    actors: { type: DataTypes.TEXT },
    plot: { type: DataTypes.TEXT },
    //
    poster: { type: DataTypes.TEXT }, //name of poster .jpg file
    theme: { type: DataTypes.TEXT }, //name of intro .mp3 file
    german: { type: DataTypes.TEXT }, //name of german .mp4 file
    english: { type: DataTypes.TEXT }, //name of english .mp4 file
    //
    changes: { type: DataTypes.INTEGER, defaultValue: 0 },
    //
    elapsed_time: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_watched: { type: DataTypes.DATE },
  },

  {
    sequelize,
    modelName: "Episodes",
    timestamps: false,
  }
);

module.exports = episodeModel;
