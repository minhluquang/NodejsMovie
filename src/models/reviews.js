"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here if needed
      // For example:
      Review.hasMany(models.MovieReview, {
        foreignKey: "review_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Review.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Review.init(
    {
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Account",
          key: "account_id",
        },
      },
      content: {
        type: DataTypes.TEXT,
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
      modelName: "Review",
      tableName: "reviews",
      timestamps: true,
    }
  );
  return Review;
};
