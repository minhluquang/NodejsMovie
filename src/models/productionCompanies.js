"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductionCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here if needed
      // For example:
      ProductionCompany.belongsTo(models.TVSeriesProductionCompany, {
        foreignKey: "production_company_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      ProductionCompany.belongsTo(models.MovieProductionCompany, {
        foreignKey: "production_company_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  ProductionCompany.init(
    {
      production_company_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      original_country: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      logo_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ProductionCompany",
      tableName: "production_companies",
      timestamps: true,
    }
  );
  return ProductionCompany;
};
