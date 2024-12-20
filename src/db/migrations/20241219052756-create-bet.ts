/** @type {import('sequelize-cli').Migration} */

import { type DataTypes, QueryInterface } from 'sequelize';
import { TeamType, BetStatus } from 'validators';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Bets', {
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
      userId: {
        allowNull: false,
        onDelete: 'CASCADE',
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
      },
      selectedTeam: {
        allowNull: false,
        type: Sequelize.ENUM(TeamType.HOME, TeamType.AWAY, TeamType.DRAW),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(BetStatus.PENDING, BetStatus.WON, BetStatus.LOST),
        defaultValue: BetStatus.PENDING,
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      odds: {
        allowNull: false,
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('Bets');
  },
};
