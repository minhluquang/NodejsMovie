"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.hasOne(models.AccountDetail, {
        foreignKey: "account_id",
        as: "account_detail",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Account.hasOne(models.EmailConfirmation, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Account.hasMany(models.SocialNetworkDetail, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Account.belongsTo(models.Role, {
        foreignKey: "role_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Account.init(
    {
      account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: { type: DataTypes.STRING(128), allowNull: false },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      is_active: { type: DataTypes.TINYINT(1), allowNull: false },
      is_verified: { type: DataTypes.TINYINT(1), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      email_verify_at: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "Account",
      tableName: "accounts",
      timestamps: false,
    }
  );
  return Account;
};
