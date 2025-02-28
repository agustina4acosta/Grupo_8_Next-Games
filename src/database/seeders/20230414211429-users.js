'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcryptjs = require('bcryptjs')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 1,
          firstName: "admin",
          LastName: "nextgames",
          email: "nextventa@nextgames.com.ar",
          password: bcryptjs.hashSync('Juga_prim1', 12),
          userName: "nextgamesAdmin",
          image: "admin.jpg",
          rolId: 1,
          addressId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: "Luis",
          LastName: "Dick",
          email: "luchodick24@gmail.com",
          password: bcryptjs.hashSync('Lucho_3323', 12),
          userName: "Murdoy",
          image: "1680127198004_users_.png",
          rolId: 1,
          addressId: 2,
          createdAt : new Date(),
          updatedAt : new Date(),
        }

      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
