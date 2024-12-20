/** @type {import('sequelize-cli').Migration} */

import { QueryInterface } from 'sequelize';
import { BetStatus, TeamType } from 'validators';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('Bets', [
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1c',
        gameId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1c',
        userId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1c',
        amount: 10,
        selectedTeam: TeamType.HOME,
        odds: 1.85,
        status: BetStatus.PENDING,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b13',
        gameId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        userId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1c',
        amount: 5,
        selectedTeam: TeamType.HOME,
        odds: 1.75,
        status: BetStatus.PENDING,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1d',
        gameId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1d',
        userId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1d',
        amount: 20,
        selectedTeam: TeamType.AWAY,
        odds: 1.85,
        status: BetStatus.WON,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        gameId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        userId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        amount: 20,
        selectedTeam: TeamType.AWAY,
        odds: 1.85,
        status: BetStatus.WON,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b12',
        gameId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        userId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1d',
        amount: 20,
        selectedTeam: TeamType.HOME,
        odds: 1.85,
        status: BetStatus.WON,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Bets', {}, {});
  },
};
