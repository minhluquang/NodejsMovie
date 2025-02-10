"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TVSeriesKeyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TVSeriesKeyword.belongsTo(models.Keyword, {
        foreignKey: "keyword_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      TVSeriesKeyword.belongsTo(models.tvSeries, {
        foreignKey: "tv_series_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  TVSeriesKeyword.init(
    {
      tv_series_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      keyword_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "TVSeriesKeyword",
      tableName: "tv_series_keywords",
      timestamps: false,
    }
  );
  return TVSeriesKeyword;
};
