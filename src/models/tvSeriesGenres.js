"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TVSeriesGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TVSeriesGenre.belongsTo(models.Genre, {
        foreignKey: "genre_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TVSeriesGenre.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  TVSeriesGenre.init(
    {
      tv_series_id: {
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
      modelName: "TVSeriesGenre",
      tableName: "tv_series_genres",
      timestamps: false,
    }
  );
  return TVSeriesGenre;
};
