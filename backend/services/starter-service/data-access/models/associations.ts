import { DataTypes } from 'sequelize';
import getDbConnection from './db-connection';
import { getUserModel } from './user-model';
import { getTeamModel } from './team-model';
import { getRoleModel } from './role-model';
import { getPermissionModel } from './permission-model';

export function establishAssociations() {
  const User = getUserModel();
  const Team = getTeamModel();
  const Role = getRoleModel();
  const Permission = getPermissionModel();

  // Intermediary models for many-to-many relationships
  const UserTeam = getDbConnection().define(
    'UserTeam',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      teamId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  const UserRole = getDbConnection().define(
    'UserRole',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  const UserPermission = getDbConnection().define(
    'UserPermission',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  // Define the many-to-many relationships
  User.belongsToMany(Team, {
    through: UserTeam,
    foreignKey: 'userId',
    otherKey: 'teamId',
  });
  Team.belongsToMany(User, {
    through: UserTeam,
    foreignKey: 'teamId',
    otherKey: 'userId',
  });

  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
  });
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId',
  });

  User.belongsToMany(Permission, {
    through: UserPermission,
    foreignKey: 'userId',
    otherKey: 'permissionId',
  });
  Permission.belongsToMany(User, {
    through: UserPermission,
    foreignKey: 'permissionId',
    otherKey: 'userId',
  });

  // eslint-disable-next-line no-console
  console.log('ASSOCIATIONS ESTABLISHED');
}
