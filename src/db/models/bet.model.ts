import {
  Model,
  UUIDV4,
  DataTypes,
  InferAttributes,
  CreationOptional,
} from 'sequelize';
import { decorate, injectable } from 'inversify';

import sequelize from 'configs/sequelize.config';
import { UserModel } from './user.model';
import { BetStatus, TeamType } from 'validators';

class BetModel extends Model<BetModelDto> {
  declare odds: number;
  declare gameId: string;
  declare userId: string;
  declare amount: number;
  declare id?: CreationOptional<string>;
  declare status?: CreationOptional<BetStatus>;
  declare createdAt?: CreationOptional<string>;
  declare updatedAt?: CreationOptional<string>;
  declare selectedTeam: TeamType;
}

BetModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
      type: DataTypes.UUID,
    },
    gameId: {
      allowNull: false,
      onDelete: 'CASCADE',
      type: DataTypes.UUID,
      references: { model: 'Games', key: 'id' },
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    selectedTeam: {
      allowNull: false,
      type: DataTypes.ENUM(TeamType.HOME, TeamType.AWAY, TeamType.DRAW),
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(BetStatus.PENDING, BetStatus.WON, BetStatus.LOST),
      defaultValue: BetStatus.PENDING,
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    odds: {
      allowNull: false,
      type: DataTypes.FLOAT,
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
    modelName: 'Bets',
  },
);

// Define associations within the models
BetModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

decorate(injectable(), BetModel);

export { BetModel };

export type BetModelDto = InferAttributes<BetModel>;
