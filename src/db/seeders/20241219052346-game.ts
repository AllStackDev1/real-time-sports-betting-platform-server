/** @type {import('sequelize-cli').Migration} */

import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('Games', [
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1c',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        homeScore: 87,
        awayScore: 82,
        timeRemaining: '4:35 Q4', // new Date()
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1d',
        homeTeam: 'Celtics',
        awayTeam: 'Heat',
        homeScore: 64,
        awayScore: 70,
        timeRemaining: '2:15 Q3',
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        homeTeam: 'Bucks',
        awayTeam: 'Suns',
        homeScore: 55,
        awayScore: 53,
        timeRemaining: '8:45 Q3',
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
      },
    ]);

    await queryInterface.bulkInsert('Odds', [
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1c',
        home: 1.85,
        away: 2.1,
        draw: 15.0,
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
        gameId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1c',
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1d',
        home: 2.5,
        away: 1.65,
        draw: 17.0,
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
        gameId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1d',
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        gameId: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        home: 1.95,
        away: 1.9,
        draw: 16.0,
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Odds', {}, {});
    await queryInterface.bulkDelete('Games', {}, {});
  },
};
