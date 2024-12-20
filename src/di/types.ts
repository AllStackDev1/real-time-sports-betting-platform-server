export const TYPES = {
  // Server
  Server: Symbol.for('Server'),
  Express: Symbol.for('Express'),

  // Models
  BetModel: Symbol.for('BetModel'),
  GameModel: Symbol.for('GameModel'),
  OddsModel: Symbol.for('OddsModel'),
  UserModel: Symbol.for('UserModel'),

  // Respositories
  BetRepository: Symbol.for('BetRepository'),
  OddsRepository: Symbol.for('OddsRepository'),
  GameRepository: Symbol.for('GameRepository'),
  UserRepository: Symbol.for('UserRepository'),

  // Services
  BetService: Symbol.for('BetService'),
  GameService: Symbol.for('GameService'),
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  RedisService: Symbol.for('RedisService'),
  SocketService: Symbol.for('SocketService'),
  SimulationService: Symbol.for('SimulationService'),

  // Controllers
  BetController: Symbol.for('BetController'),
  GameController: Symbol.for('GameController'),
  AuthController: Symbol.for('AuthController'),
  UserController: Symbol.for('UserController'),

  // Middleware
  AuthHandler: Symbol.for('AuthHandler'),
  SessionHandler: Symbol.for('SessionHandler'),
  RateLimitHandler: Symbol.for('RateLimitHandler'),
};
