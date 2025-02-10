"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Genre.hasMany(models.MovieGenre, {
        foreignKey: "genre_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Genre.init(
    {
      genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.INTEGER,
        type: DataTypes.STRING(50),
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
      modelName: "Genre",
      tableName: "genres",
      timestamps: true,
    }
  );
  return Genre;
};
