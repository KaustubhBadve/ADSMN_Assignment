const constant = require("../constants/constant");

module.exports = (sequelize, DataType) => {
  const score = sequelize.define(
    constant.DB.table.SCORE_MASTER,
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataType.BIGINT,
      },
      userId: {
        type: DataType.BIGINT,
        allowNull: false
      },
      score: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataType.BIGINT,
      },
      updatedAt: {
        allowNull: false,
        type: DataType.BIGINT,
      },
    },
    {
      hooks: {
        beforeCreate: async (user, options) => {
          user.createdAt = Math.floor(Date.now());
          user.updatedAt = Math.floor(Date.now());
        },
        beforeUpdate: async (user, options) => {
          user.updatedAt = Math.floor(Date.now());
        }
      },
    }
  );

  return score;
};
