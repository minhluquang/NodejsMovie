"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here if needed
      // For example:
      List.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      List.hasMany(models.MediaList, {
        foreignKey: "list_id",
        as: "media_lists",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  List.init(
    {
      list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Account",
          key: "account_id",
        },
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      poster_path: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      is_public: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      is_comment: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      sort_by: {
        type: DataTypes.ENUM(
          "originalAcs",
          "orginalDes",
          "ratingAcs",
          "ratingDes",
          "releaseDateAcs",
          "releaseDateDes",
          "titleAsc",
          "titleDes"
        ),
        allowNull: false,
        defaultValue: "originalAcs",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "List",
      tableName: "lists",
      timestamps: false,
    }
  );
  return List;
};
