"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TvSeasonPeople extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      TvSeasonPeople.belongsTo(models.tvSeason, {
        foreignKey: "tv_season_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TvSeasonPeople.belongsTo(models.People, {
        foreignKey: "person_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  TvSeasonPeople.init(
    {
      tv_season_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      person_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      character_role: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      job: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "tvSeasonPeople",
      tableName: "tv_season_people",
      timestamps: false,
      primaryKey: false,
    }
  );

  return TvSeasonPeople;
};
