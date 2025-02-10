"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TVSeriesCertification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TVSeriesCertification.belongsTo(models.Certification, {
        foreignKey: "certification_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TVSeriesCertification.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  TVSeriesCertification.init(
    {
      tv_series_id: {
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
      modelName: "TVSeriesCertification",
      tableName: "tv_series_certifications",
      timestamps: false,
    }
  );
  return TVSeriesCertification;
};
