"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Account.belongsTo(models.Role, {
      //   foreignKey: "role_id",
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE",
      // });
    }
  }
  Movie.init(
    {
      movie_id: {
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
      budget: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      homepage: {
        type: DataTypes.STRING(50),
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
      original_title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      overview: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      popularity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      poster_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      release_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revenue: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      runtime: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      vote_average: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      vote_count: {
        type: DataTypes.INTEGER,
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
      modelName: "Movie",
      tableName: "movies",
      timestamps: true,
    }
  );
  return Movie;
};
