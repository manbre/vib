const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

class movieModel extends Model {}

movieModel.init(
  {
    title: { type: DataTypes.TEXT }, //english title
    series: { type: DataTypes.TEXT }, //film series
    director: { type: DataTypes.TEXT },
    genre: { type: DataTypes.TEXT },
    //
    year: { type: DataTypes.INTEGER },
    fsk: { type: DataTypes.INTEGER, defaultValue: 0 }, //self regulatory
    awards: { type: DataTypes.INTEGER }, //oscars
    rating: { type: DataTypes.INTEGER }, //rotten tomatoes
    runtime: { type: DataTypes.INTEGER },
    //
    actors: { type: DataTypes.TEXT },
    plot: { type: DataTypes.TEXT },
    //
    poster: { type: DataTypes.TEXT }, //name of poster .jpg file
    teaser: { type: DataTypes.TEXT }, //name of trailer .mp4 file
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
    modelName: "Movies",
    timestamps: false,
  }
);

module.exports = movieModel;
