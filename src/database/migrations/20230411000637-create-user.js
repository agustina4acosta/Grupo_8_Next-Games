'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      LastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      userName: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      socialId:{
        type: Sequelize.STRING
      },
      socialprovider:{
        type: Sequelize.STRING
      },
      rolId: {
        type: Sequelize.INTEGER,
        references : {
          model :{
            tableName : "Rols"
          },
          key : 'id'
        }
      },
      addressId: {
        type: Sequelize.INTEGER,
        references : {
          model :{
            tableName : "Addresses"
          },
          key : 'id'
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
    await queryInterface.dropTable('Users');
  }
};