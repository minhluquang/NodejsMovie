"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MovieCertification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MovieCertification.belongsTo(models.Certification, {
        foreignKey: "certification_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      MovieCertification.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  MovieCertification.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      certification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "MovieCertification",
      tableName: "movie_certifications",
      timestamps: false,
    }
  );
  return MovieCertification;
};
