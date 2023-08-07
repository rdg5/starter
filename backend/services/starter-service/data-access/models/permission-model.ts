import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';

export interface PermissionModelFields
  extends Model<
    InferAttributes<PermissionModelFields>,
    InferCreationAttributes<PermissionModelFields>
  > {
  id: CreationOptional<number>;
  ability: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
}

let permissionModel;
export function getPermissionModel() {
  if (!permissionModel) {
    permissionModel = getDbConnection().define<PermissionModelFields>(
      'Permission',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ability: {
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
  }

  // eslint-disable-next-line no-console
  console.log('Role model defined!');
  return permissionModel;
}
