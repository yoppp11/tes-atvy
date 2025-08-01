'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      task.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user',
      })
    }
  }
  task.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'task',
  });
  return task;
};