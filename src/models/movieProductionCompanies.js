"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MovieProductionCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MovieProductionCompany.belongsTo(models.ProductionCompany, {
        foreignKey: "production_company_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      MovieProductionCompany.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  MovieProductionCompany.init(
    {
      movie_id: {
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
      modelName: "MovieProductionCompany",
      tableName: "movie_production_companies",
      timestamps: false,
    }
  );
  return MovieProductionCompany;
};
