import { injectable, inject } from 'inversify';
import { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';

import { TYPES } from 'di/types';
import { AuthService } from './auth.service';
import { GameService } from './game.service';
import { BetService } from './bet.service';

@injectable()
export class SocketService {
  private io: SocketIOServer;

  constructor(
    @inject(TYPES.Server)
    httpServer: HttpServer,
    @inject(TYPES.AuthService)
    private authService: AuthService,
    @inject(TYPES.GameService)
    private gameService: GameService,
    @inject(TYPES.BetService)
    private betService: BetService,
  ) {
    // Initialize Socket.IO with the provided HTTP server
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*', // Allow all origins (configure as needed for your environment)
        methods: ['GET', 'POST'],
      },
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }

  public setupListeners(): void {
    this.io.on('connection', async (socket) => {
      logger.log('----------------------------------------');
      logger.log(`Socket client connected: ${socket.id}`);
      logger.log('----------------------------------------');
      // Access request headers through socket.handshake.headers
      const accessToken = socket.handshake.query.authorization as string;

      // Validate the token (if needed)
      const { error } = await this.authService.validateJWT(accessToken);
      if (error) {
        socket.disconnect(); // Disconnect if the token is invalid
      }

      // Broadcast game updates every 5 seconds
      const broadcastInterval1 = setInterval(async () => {
        try {
          const { data: games } = await this.gameService.getGamesByQuery({});

          games.forEach((game) => {
            if (game.timeRemaining !== 'Final') {
              this.io.emit('gameData', game);
            }
          });
        } catch (error) {
          logger.error('Failed to broadcast games:', error);
        }
      }, 5000);

      // Broadcast leaderboard updates every 5 seconds
      const broadcastInterval2 = setInterval(async () => {
        try {
          const data = await this.betService.getLeaderboard();
          this.io.emit('leaderboardUpdate', data);
        } catch (error) {
          logger.error('Failed to broadcast games:', error);
        }
      }, 5000);

      socket.on('disconnect', () => {
        logger.log('----------------------------------------');
        logger.log(`Socket client disconnected: ${socket.id}`);
        logger.log('----------------------------------------');

        // Clear intervals on disconnect
        clearInterval(broadcastInterval1);
        clearInterval(broadcastInterval2);

        // Clean up any listeners or state
        socket.removeAllListeners();
      });
    });
  }
}
