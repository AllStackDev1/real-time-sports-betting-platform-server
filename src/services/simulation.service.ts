import { injectable, inject } from 'inversify';
import { CronJob } from 'cron';
import { TYPES } from 'di/types';
import { GameService } from './game.service';
import { BetService } from './bet.service';
import { BetStatus } from 'validators/bet.zod.schema';

@injectable()
export class SimulationService {
  private gameUpdateJob: CronJob;
  private leaderboardUpdateJob: CronJob;

  constructor(
    @inject(TYPES.GameService)
    private gameService: GameService,
    @inject(TYPES.BetService)
    private betService: BetService,
  ) {
    // Run every 30 seconds
    this.gameUpdateJob = new CronJob(
      '*/30 * * * * *',
      this.updateGames.bind(this),
    );

    // Run leaderboard updates every 5 seconds
    this.leaderboardUpdateJob = new CronJob(
      '*/5 * * * * *',
      this.updateLeaderboard.bind(this),
    );
  }

  private generateScoreChange(): number {
    return Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
  }

  private calculateNewOdds(homeScore: number, awayScore: number) {
    const scoreDiff = homeScore - awayScore;
    return {
      home: Math.max(1.1, 2 - scoreDiff * 0.1),
      away: Math.max(1.1, 2 + scoreDiff * 0.1),
      draw: Math.max(10, 15 - Math.abs(scoreDiff)),
    };
  }

  private async updateGames(): Promise<void> {
    try {
      const { data: games } = await this.gameService.getAllGames();

      for (const game of games) {
        if (game.timeRemaining === 'Final') continue;

        const homeScoreChange = this.generateScoreChange();
        const awayScoreChange = this.generateScoreChange();

        const newHomeScore = game.homeScore + homeScoreChange;
        const newAwayScore = game.awayScore + awayScoreChange;

        // Update game scores and time
        await this.gameService.update(game.id!, {
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          timeRemaining: this.updateGameTime(game.timeRemaining),
        });

        // Update odds if scores changed
        if (homeScoreChange > 0 || awayScoreChange > 0) {
          const newOdds = this.calculateNewOdds(newHomeScore, newAwayScore);
          await this.gameService.updateGameOdds(game.id!, newOdds);
        }
      }
    } catch (error) {
      logger.error('Failed to update games:', error);
    }
  }

  private updateGameTime(currentTime: string): string {
    const [time, quarter] = currentTime.split(' ');
    const [minutes, seconds] = time.split(':').map(Number);

    const totalSeconds = minutes * 60 + seconds - 30; // 30 seconds decrease
    if (totalSeconds < 0) {
      switch (quarter) {
        case 'Q1':
          return '12:00 Q2';
        case 'Q2':
          return '12:00 Q3';
        case 'Q3':
          return '12:00 Q4';
        case 'Q4':
          return 'Final';
        default:
          return currentTime;
      }
    }

    const newMinutes = Math.floor(totalSeconds / 60);
    const newSeconds = totalSeconds % 60;
    return `${newMinutes}:${newSeconds.toString().padStart(2, '0')} ${quarter}`;
  }

  private async updateLeaderboard(): Promise<void> {
    try {
      // Simulate random updates to bets
      const pendingBets = await this.betService.getBetsByQuery({
        status: BetStatus.PENDING,
      });

      for (const bet of pendingBets.data) {
        if (Math.random() > 0.7) {
          // 30% chance to resolve a pending bet
          await this.betService.updateById(bet.id!, {
            status: Math.random() > 0.5 ? BetStatus.WON : BetStatus.LOST,
          });
        }
      }
    } catch (error) {
      logger.error('Failed to update leaderboard:', error);
    }
  }

  public start(): void {
    this.gameUpdateJob.start();
    this.leaderboardUpdateJob.start();
    logger.info('Game and leaderboard simulation cron jobs started');
  }

  public stop(): void {
    this.gameUpdateJob.stop();
    this.leaderboardUpdateJob.stop();
    logger.info('Game and leaderboard simulation cron jobs stopped');
  }
}
