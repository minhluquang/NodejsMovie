"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tvSeries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tvSeries.hasMany(models.tvSeason, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  tvSeries.init(
    {
      tv_series_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      adult: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      backdrop_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      first_air_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      homepage: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      in_production: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      origin_country: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      original_language: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      original_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      overview: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      poster_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      popularity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vote_average: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      vote_count: {
        type: DataTypes.INTEGER,
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
      modelName: "tvSeries",
      tableName: "tv_series",
      timestamps: true,
    }
  );
  return tvSeries;
};
