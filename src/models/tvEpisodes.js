"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class tvEpisode extends Model {
    static associate(models) {
      // 1 tvEpisode thuộc về 1 tvSeason
      tvEpisode.belongsTo(models.tvSeason, {
        foreignKey: "tv_season_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  tvEpisode.init(
    {
      tv_episode_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tv_season_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tvSeasons",
          key: "tv_season_id",
        },
      },
      air_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      episode_number: {
        type: DataTypes.SMALLINT(6),
        allowNull: false,
      },
      episode_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      overview: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      runtime: {
        type: DataTypes.SMALLINT(6),
        allowNull: true,
      },
      still_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
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
      modelName: "tvEpisode",
      tableName: "tv_episodes",
      timestamps: true,
    }
  );

  return tvEpisode;
};
