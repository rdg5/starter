import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';

export interface RoleModelFields
  extends Model<
    InferAttributes<RoleModelFields>,
    InferCreationAttributes<RoleModelFields>
  > {
  id: CreationOptional<number>;
  role: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
}
let roleModel;

export function getRoleModel() {
  if (!roleModel) {
    roleModel = getDbConnection().define<RoleModelFields>(
      'Role',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        role: {
          type: DataTypes.STRING,
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
      { freezeTableName: true, paranoid: true }
    );

    // eslint-disable-next-line no-console
    console.log('Role model defined!');
  }
  return roleModel;
}
