"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TVSeriesImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TVSeriesImage.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TVSeriesImage.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  TVSeriesImage.init(
    {
      tv_series_image_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tv_series_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      season: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      episode: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      aspect_ratio: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      iso_639_1: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      height: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      width: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      vote_average: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      vote_count: {
        type: DataTypes.INTEGER,
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
      modelName: "TVSeriesImage",
      tableName: "tv_series_images",
      timestamps: true,
    }
  );
  return TVSeriesImage;
};
