"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FavoriteTVSeries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FavoriteTVSeries.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      FavoriteTVSeries.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  FavoriteTVSeries.init(
    {
      account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      tv_series_id: {
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
      modelName: "FavoriteTVSeries",
      tableName: "favorite_tv_series",
      timestamps: false,
    }
  );
  return FavoriteTVSeries;
};
