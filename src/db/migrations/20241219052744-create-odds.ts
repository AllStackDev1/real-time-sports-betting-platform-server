/** @type {import('sequelize-cli').Migration} */

import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Odds', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      gameId: {
        allowNull: false,
        onDelete: 'CASCADE',
        type: Sequelize.UUID,
        references: { model: 'Games', key: 'id' },
      },
      home: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      away: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      draw: {
        allowNull: false,
        type: DataTypes.FLOAT,
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
    await queryInterface.dropTable('Odds');
  },
};
