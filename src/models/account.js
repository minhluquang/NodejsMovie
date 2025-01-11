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
    }
  }
  Account.init(
    {
      account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: DataTypes.INTEGER,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      is_active: DataTypes.TINYINT(1),
      is_verified: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "Account",
      timestamps: false,
    }
  );
  return Account;
};
