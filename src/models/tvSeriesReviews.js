"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TVSeriesReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the associations here
      TVSeriesReview.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TVSeriesReview.belongsTo(models.Review, {
        foreignKey: "review_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  TVSeriesReview.init(
    {
      tv_series_id: {
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
      modelName: "TVSeriesReview",
      tableName: "tv_series_reviews",
      timestamps: false,
    }
  );

  return TVSeriesReview;
};
