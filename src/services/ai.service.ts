import OpenAI from 'openai';
import { injectable } from 'inversify';
import { GameCreateSchema } from 'validators';
import { OPEN_API_KEY } from 'configs/env.config';

@injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: OPEN_API_KEY });
  }

  public async generateGames(): Promise<GameCreateSchema[]> {
    let games: GameCreateSchema[] = [];

    const content = `
      Generate 3 examples of basketball games for a sports betting platform in the following format:
      [
        {
          homeTeam: "Team A", // any NBA team (use short names)
          awayTeam: "Team B", // any NBA team (use short names)
          homeScore: 10,
          awayScore: 30,
          timeRemaining: "4:35 Q4", // vary the quarter number
          odds: {
            home: 1.23,
            away: 2.50,
            draw: 10
          }
        },
        ...
      ]

      Replace the placeholders with appropriate NBA teams and realistic values.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates basketball games.',
        },
        {
          role: 'user',
          content,
        },
      ],
    });

    try {
      games = JSON.parse(response.choices[0]?.message?.content || '[]');
    } catch (error) {
      logger.error('Failed to parse JSON:', error);
      games = [];
    }
    return games;
  }
}
