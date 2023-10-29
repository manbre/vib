const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

class seasonModel extends Model {}

seasonModel.init(
  {
    title: { type: DataTypes.TEXT },
    //
    creator: { type: DataTypes.TEXT },
    genre: { type: DataTypes.TEXT },
    //
    fsk: { type: DataTypes.INTEGER, defaultValue: 0 }, //self regulatory
    season: { type: DataTypes.INTEGER },
    runtime: { type: DataTypes.INTEGER },
    //
    actors: { type: DataTypes.TEXT },
    //
    poster: { type: DataTypes.TEXT }, //name of poster .jpg file
    teaser: { type: DataTypes.TEXT }, //name of intro .mp3 file
    //
    changes: { type: DataTypes.INTEGER, defaultValue: 0 },
    //
  },

  {
    sequelize,
    modelName: "Seasons",
    timestamps: false,
  }
);

module.exports = seasonModel;