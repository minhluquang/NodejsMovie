"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Certification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Certification.hasMany(models.MovieCertification, {
        foreignKey: "certification_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Certification.hasMany(models.TVSeriesCertification, {
        foreignKey: "certification_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Certification.init(
    {
      certification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      certification: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      mean: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("tv", "movie"),
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
      modelName: "Certification",
      tableName: "certifications",
      timestamps: true,
    }
  );
  return Certification;
};
