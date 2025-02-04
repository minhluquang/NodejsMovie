"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MoviePeople extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the associations here
      MoviePeople.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      MoviePeople.belongsTo(models.People, {
        foreignKey: "person_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  MoviePeople.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      person_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
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
      modelName: "MoviePeople",
      tableName: "movie_people",
      timestamps: false,
    }
  );

  return MoviePeople;
};
