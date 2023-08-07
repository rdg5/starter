import { Sequelize } from 'sequelize';
import * as configurationProvider from '@practica/configuration-provider';
import { logger } from '@practica/logger';
// import { establishAssociations } from './associations';
import { getUserModel } from './user-model';
import { getTeamModel } from './team-model';
import { getRoleModel } from './role-model';
import { getPermissionModel } from './permission-model';
import { establishAssociations } from './associations';

let dbConnection: Sequelize;

export default function getDbConnection() {
  if (!dbConnection) {
    dbConnection = new Sequelize(
      configurationProvider.getValue('DB.dbName'),
      configurationProvider.getValue('DB.userName'),
      configurationProvider.getValue('DB.password'),
      {
        port: 54320,
        dialect: 'postgres',
        benchmark: true,
        logging: (sql: string, duration?: number) => {
          logger.info(
            `Sequelize operation was just executed in ${duration} ms with sql: ${sql}`
          );
        },
        logQueryParameters: true,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
    getUserModel();
    getTeamModel();
    getRoleModel();
    getPermissionModel();

    establishAssociations();
    // dbConnection.sync({ alter: true });
    // eslint-disable-next-line no-console
    console.log('DB & TABLES CREATED');
  }

  return dbConnection;
}
