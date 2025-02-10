"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MovieReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the associations here
      MovieReview.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      MovieReview.belongsTo(models.Review, {
        foreignKey: "review_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  MovieReview.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      review_id: {
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
      modelName: "MovieReview",
      tableName: "movie_reviews",
      timestamps: false,
    }
  );

  return MovieReview;
};
