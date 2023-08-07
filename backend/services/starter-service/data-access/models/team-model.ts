import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';

export interface TeamModelFields
  extends Model<
    InferAttributes<TeamModelFields>,
    InferCreationAttributes<TeamModelFields>
  > {
  id: CreationOptional<number>;
  name: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
}

let teamModel;
export function getTeamModel() {
  if (!teamModel) {
    teamModel = getDbConnection().define<TeamModelFields>(
      'Team',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
      },
      { freezeTableName: true }
    );

    // eslint-disable-next-line no-console
    console.log('TEAM model defined!');
  }
  return teamModel;
}
