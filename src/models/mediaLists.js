"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MediaList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here if needed
      // For example:
      MediaList.belongsTo(models.List, {
        foreignKey: "list_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      MediaList.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      MediaList.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  MediaList.init(
    {
      list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "List",
          key: "list_id",
        },
      },
      movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        references: {
          model: "Movie",
          key: "movie_id",
        },
      },
      tv_series_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        references: {
          model: "tvSeries",
          key: "tv_series_id",
        },
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "MediaList",
      tableName: "media_lists",
      timestamps: false,
    }
  );
  return MediaList;
};
