"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MovieKeyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MovieKeyword.belongsTo(models.Keyword, {
        foreignKey: "keyword_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      MovieKeyword.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  MovieKeyword.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      keyword_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "MovieKeyword",
      tableName: "movie_keywords",
      timestamps: false,
    }
  );
  return MovieKeyword;
};
