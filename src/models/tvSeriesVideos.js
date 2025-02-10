"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TVSeriesVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TVSeriesVideo.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TVSeriesVideo.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  TVSeriesVideo.init(
    {
      tv_series_video_id: {
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
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      video_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      site: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      size: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      official: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      published_at: {
        type: DataTypes.DATE,
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
      modelName: "TVSeriesVideo",
      tableName: "tv_series_videos",
      timestamps: true,
    }
  );
  return TVSeriesVideo;
};
