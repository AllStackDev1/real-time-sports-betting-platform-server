import {
  Model,
  UUIDV4,
  DataTypes,
  InferAttributes,
  CreationOptional,
  Association,
} from 'sequelize';
import { decorate, injectable } from 'inversify';

import sequelize from 'configs/sequelize.config';

import { OddsModel, OddsModelDto } from './odds.model';

class GameModel extends Model<GameModelDto> {
  declare homeTeam: string;
  declare awayTeam: string;
  declare awayScore: number;
  declare homeScore: number;
  declare timeRemaining: string;
  declare id?: CreationOptional<string>;
  declare createdAt?: CreationOptional<string>;
  declare updatedAt?: CreationOptional<string>;
  declare odds?: CreationOptional<OddsModelDto>;

  declare static associations: {
    odds: Association<GameModel, OddsModel>;
  };
}

GameModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
      type: DataTypes.UUID,
    },
    homeTeam: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    awayTeam: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    homeScore: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    awayScore: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    timeRemaining: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Games',
  },
);

// Define associations within the models
GameModel.hasOne(OddsModel, { foreignKey: 'gameId', as: 'odds' });
OddsModel.belongsTo(GameModel, { as: 'game', foreignKey: 'gameId' });

decorate(injectable(), GameModel);

export { GameModel };

export type GameModelDto = InferAttributes<GameModel>;
