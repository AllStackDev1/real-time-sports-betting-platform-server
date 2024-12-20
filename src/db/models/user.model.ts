import {
  Model,
  UUIDV4,
  DataTypes,
  InferAttributes,
  CreationOptional,
} from 'sequelize';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { decorate, injectable } from 'inversify';

import sequelize from 'configs/sequelize.config';
import { HASHING_SALT, jwtConfig } from 'configs/env.config';

class UserModel extends Model<UserModelDto> {
  declare password: string;
  declare username: string;
  declare id?: CreationOptional<string>;
  declare rank?: CreationOptional<number>;
  declare email?: CreationOptional<string>;
  declare balance?: CreationOptional<number>;
  declare createdAt?: CreationOptional<string>;
  declare updatedAt?: CreationOptional<string>;
  declare deletedAt?: CreationOptional<string>;
  declare totalWinnings?: CreationOptional<number>;

  async isPasswordMatch(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  generateJWT(type: 'access' | 'refresh' | 'reset' | 'verify') {
    const { secretKey, accessExpiresIn, refreshExpiresIn, defaultExpiresIn } =
      jwtConfig;
    return sign(
      { sub: this.id, email: this.email, username: this.username, type },
      secretKey,
      {
        expiresIn:
          type === 'access'
            ? accessExpiresIn
            : type === 'refresh'
              ? refreshExpiresIn
              : defaultExpiresIn,
      },
    );
  }
}

UserModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
      type: DataTypes.UUID,
    },
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 100.0,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        const salt = bcrypt.genSaltSync(+HASHING_SALT);
        const hash = bcrypt.hashSync(value, salt + this.email);
        this.setDataValue('password', hash);
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    paranoid: true,
    freezeTableName: true,
    modelName: 'Users',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    hooks: {
      beforeCreate: async (user: UserModel) => {
        const count = await UserModel.count();
        user.rank = count + 1;
      },
    },
  },
);

decorate(injectable(), UserModel);

export { UserModel };

export type UserModelDto = InferAttributes<UserModel>;
