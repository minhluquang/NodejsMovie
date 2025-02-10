"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MovieGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MovieGenre.belongsTo(models.Genre, {
        foreignKey: "genre_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      MovieGenre.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  MovieGenre.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "MovieGenre",
      tableName: "movie_genres",
      timestamps: false,
    }
  );
  return MovieGenre;
};
