"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmailConfirmation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmailConfirmation.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  EmailConfirmation.init(
    {
      email_confirmation_id: {
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
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(500),
      },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "EmailConfirmation",
      tableName: "email_confirmations",
      timestamps: false,
    }
  );
  return EmailConfirmation;
};
