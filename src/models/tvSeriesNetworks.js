"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TVSeriesNetwork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TVSeriesNetwork.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TVSeriesNetwork.belongsTo(models.Network, {
        foreignKey: "network_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  TVSeriesNetwork.init(
    {
      tv_Series_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      network_id: {
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
      modelName: "TVSeriesNetwork",
      tableName: "tv_series_networks",
      timestamps: false,
    }
  );
  return TVSeriesNetwork;
};
