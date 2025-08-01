'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          isUnique: async (value, next) => {
            try {
              const user = await queryInterface.sequelize.query(
                `SELECT * FROM users WHERE username = :username`,
                {
                  replacements: { username: value },
                  type: Sequelize.QueryTypes.SELECT
                }
              );
              if (user.length > 0) {
                return next('Username already exists');
              }
              return next();
            } catch (error) {
              return next(error);
            }
          },
          notEmpty: {
            msg: 'Username is required'
          },
          notNull: {
            msg: 'Username is required'
          }
        }
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};