"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class tvEpisodePeople extends Model {
    static associate(models) {
      tvEpisodePeople.belongsTo(models.tvEpisode, {
        foreignKey: "tv_episode_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      tvEpisodePeople.belongsTo(models.People, {
        foreignKey: "person_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  tvEpisodePeople.init(
    {
      tv_episode_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      person_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
      },
      character_role: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "tvEpisodePeople",
      tableName: "tv_episode_people",
      timestamps: false,
      primaryKey: false,
    }
  );

  return tvEpisodePeople;
};
