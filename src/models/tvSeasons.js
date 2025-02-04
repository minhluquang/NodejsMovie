"use strict";
const { Model } = require("sequelize");
const tvEpisodes = require("./tvEpisodes");

module.exports = (sequelize, DataTypes) => {
  class tvSeason extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tvSeason.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      tvSeason.hasMany(models.tvEpisode, {
        foreignKey: "tv_season_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  tvSeason.init(
    {
      tv_season_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tv_series_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tvSeries",
          key: "tv_series_id",
        },
      },
      air_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      overview: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      poster_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      season_number: {
        type: DataTypes.SMALLINT(6),
        allowNull: false,
      },
      vote_average: {
        type: DataTypes.FLOAT,
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
      modelName: "tvSeason",
      tableName: "tv_seasons",
      timestamps: true,
    }
  );

  return tvSeason;
};
