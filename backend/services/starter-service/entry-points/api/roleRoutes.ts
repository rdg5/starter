import express from 'express';
import { logger } from '@practica/logger';
import { AppError } from '@practica/error-handling';
import * as roleUseCase from '../../domain/role-use-case';
import { RequestWithRoleId } from './roleInterfaces';

export default function defineRoleRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info(`Role API was called to get all roles from db`);
      const response = await roleUseCase.getRoles();

      if (!response) {
        res.status(404).end();
        return;
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:roleId', async (req: RequestWithRoleId, res, next) => {
    const roleId = Number(req.params.roleId);
    try {
      logger.info(
        `Role API was called to get one role with id ${req.params.roleId} from db`
      );
      if (Number.isNaN(roleId) || Number(roleId) < 1) {
        res.status(400).send({ error: 'roleId must be a valid number.' });
        return;
      }
      const response = await roleUseCase.getRoleById(roleId);
      if (!response) {
        res.status(404).json({ error: 'Role not found' }).end();
        return;
      }
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      logger.info(`Role API was called to create a new role in the db`);
      const response = await roleUseCase.createNewRole(req.body);

      if (!response) {
        res.status(404).end();
        return;
      }
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.HTTPStatus).json({ error: error.message });
        next(error);
      }
    }
  });

  router.patch('/:roleId', async (req: RequestWithRoleId, res, next) => {
    const roleId = Number(req.params.roleId);
    try {
      logger.info(
        `Role API was called to edit role with id ${req.params.roleId} from db`
      );

      if (Number.isNaN(roleId) || Number(roleId) < 1) {
        res.status(400).send({ error: 'roleId must be a valid number.' });
        return;
      }

      const response = await roleUseCase.editExistingRole(roleId, req.body);

      if (!response) {
        res.status(404).json({ error: 'Role not found' }).end();
        return;
      }
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.HTTPStatus).json({ error: error.message });
        next(error);
      }
    }
  });

  router.delete('/:roleId', async (req: RequestWithRoleId, res, next) => {
    const roleId = Number(req.params.roleId);
    try {
      logger.info(
        `Role API was called to delete one role with id ${req.params.roleId} from db`
      );
      if (Number.isNaN(roleId) || Number(roleId) < 1) {
        res.status(400).send({ error: 'roleId must be a valid number.' });
        return;
      }

      const response = await roleUseCase.deleteRoleById(roleId);

      if (!response) {
        res.status(404).json({ error: 'Role not found' }).end();
        return;
      }

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/api/roles', router);
}
