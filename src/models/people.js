"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class People extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here if needed
      // For example:
      People.hasMany(models.tvSeasonPeople, {
        foreignKey: "person_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      People.hasMany(models.tvEpisodePeople, {
        foreignKey: "person_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      People.hasMany(models.MoviePeople, {
        foreignKey: "person_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  People.init(
    {
      person_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      adult: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      biography: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deathday: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      gender: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      homepage: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      known_for_department: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      place_of_birth: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      profile_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      popularity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
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
      modelName: "People",
      tableName: "people",
      timestamps: true,
    }
  );
  return People;
};
