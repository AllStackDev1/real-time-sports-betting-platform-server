/** @type {import('sequelize-cli').Migration} */

import { type DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      homeTeam: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      awayTeam: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      homeScore: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      awayScore: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      timeRemaining: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Games');
  },
};
