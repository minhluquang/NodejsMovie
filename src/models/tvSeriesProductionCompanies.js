"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TVSeriesProductionCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TVSeriesProductionCompany.belongsTo(models.ProductionCompany, {
        foreignKey: "production_company_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TVSeriesProductionCompany.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  TVSeriesProductionCompany.init(
    {
      tv_series_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      production_company_id: {
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
      modelName: "TVSeriesProductionCompany",
      tableName: "tv_series_production_companies",
      timestamps: false,
    }
  );
  return TVSeriesProductionCompany;
};
