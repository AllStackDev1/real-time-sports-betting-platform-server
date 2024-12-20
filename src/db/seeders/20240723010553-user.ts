/** @type {import('sequelize-cli').Migration} */

import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('Users', [
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1c',
        username: 'John Doe',
        email: 'john.doe@example.com',
        password: 'XXXXXXXXXXX',
        balance: 1000.0,
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1d',
        username: 'Jane Doe',
        password: 'XXXXXXXXXXX',
        balance: 560.0,
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
      },
      {
        id: 'b1e1a8a2-2b1b-4a6b-8b1b-2b1b1b1b1b1e',
        username: 'Bob Smith',
        password: 'XXXXXXXXXXX',
        balance: 239.0,
        createdAt: '2022-10-10T14:00:00.137Z',
        updatedAt: '2022-10-10T14:00:00.137Z',
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Users', {}, {});
  },
};
