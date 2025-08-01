'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.task, {
        foreignKey: 'userId',
        as: 'tasks',
      })
    }
  }
  user.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Username is required'
        },
        notNull: {
          msg: 'Username is required'
        },
        isUnique: async (value, next) => {
          try {
            const user = await sequelize.models.user.findOne({
              where: { username: value }
            });
            if (user) {
              return next('Username already exists');
            }
            return next();
          } catch (error) {
            return next(error);
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        },
        notNull: {
          msg: 'Password is required'
        },
        len: {
          args: [6, 100],
          msg: 'Password must be between 6 and 100 characters long'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
    hooks: {
      beforeCreate: (user, option) => {
        user.password = hashPassword(user.password)
      }
    }
  });
  return user;
};