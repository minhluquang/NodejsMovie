"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Keyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Keyword.hasMany(models.MovieKeyword, {
        foreignKey: "keyword_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Keyword.init(
    {
      keyword_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Keyword",
      tableName: "keywords",
      timestamps: true,
    }
  );
  return Keyword;
};
