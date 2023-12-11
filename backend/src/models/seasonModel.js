const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

class seasonModel extends Model {}

seasonModel.init(
  {
    series: { type: DataTypes.TEXT },
    creator: { type: DataTypes.TEXT },
    genre: { type: DataTypes.TEXT },
    //
    year: { type: DataTypes.INTEGER },
    seasonNr: { type: DataTypes.INTEGER },
    fsk: { type: DataTypes.INTEGER, defaultValue: 0 }, //self regulatory
    //
    actors: { type: DataTypes.TEXT },
    //
    poster: { type: DataTypes.TEXT }, //name of poster .jpg file
    teaser: { type: DataTypes.TEXT }, //name of intro .mp3 file
    //
    changes: { type: DataTypes.INTEGER, defaultValue: 0 },
    //
    lastWatched: { type: DataTypes.DATE },
  },

  {
    sequelize,
    modelName: "Seasons",
    timestamps: false,
  }
);

module.exports = seasonModel;
