import { dbConfig } from 'configs/env.config';

module.exports = {
  test: dbConfig,
  production: dbConfig,
  development: dbConfig,
};
