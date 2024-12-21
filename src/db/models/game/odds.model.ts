import {
  Model,
  UUIDV4,
  DataTypes,
  InferAttributes,
  CreationOptional,
} from 'sequelize';
import { decorate, injectable } from 'inversify';

import sequelize from 'configs/sequelize.config';

class OddsModel extends Model<OddsModelDto> {
  declare draw: number;
  declare away: number;
  declare home: number;
  declare gameId: string;
  declare id?: CreationOptional<string>;
  declare createdAt?: CreationOptional<string>;
  declare updatedAt?: CreationOptional<string>;
}

OddsModel.init(
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
    home: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    away: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    draw: {
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
    modelName: 'Odds',
  },
);

decorate(injectable(), OddsModel);

export { OddsModel };

export type OddsModelDto = InferAttributes<OddsModel>;
