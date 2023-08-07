import express from 'express';
import { logger } from '@practica/logger';
import { AppError } from '@practica/error-handling';
import * as permissionUseCase from '../../domain/permission-use-case';
import { RequestWithPermissionId } from './permissionInterfaces';

export default function definePermissionRoutes(
  expressApp: express.Application
) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info(`Permission API was called to get all permissions from db`);
      const response = await permissionUseCase.getAllpermissions();

      if (!response) {
        res.status(404).end();
        return;
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get(
    '/:permissionId',
    async (req: RequestWithPermissionId, res, next) => {
      const permissionId = Number(req.params.permissionId);
      try {
        logger.info(
          `Permission API was called to get one permission with id ${req.params.permissionId} from db`
        );
        if (Number.isNaN(permissionId) || Number(permissionId) < 1) {
          res
            .status(400)
            .send({ error: 'permissionId must be a valid number.' });
          return;
        }
        const response = await permissionUseCase.getPermissionById(
          permissionId
        );
        if (!response) {
          res.status(404).json({ error: 'Permission not found' }).end();
          return;
        }
        res.json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post('/', async (req, res, next) => {
    try {
      logger.info(
        `Permission API was called to create a new permission in the db`
      );
      const response = await permissionUseCase.createNewPermission(req.body);

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

  router.patch(
    '/:permissionId',
    async (req: RequestWithPermissionId, res, next) => {
      const permissionId = Number(req.params.permissionId);
      try {
        logger.info(
          `Permission API was called to edit permission with id ${req.params.permissionId} from db`
        );

        if (Number.isNaN(permissionId) || Number(permissionId) < 1) {
          res
            .status(400)
            .send({ error: 'permissionId must be a valid number.' });
          return;
        }

        const response = await permissionUseCase.editExistingPermission(
          permissionId,
          req.body
        );

        if (!response) {
          res.status(404).json({ error: 'Permission not found' }).end();
          return;
        }
        res.status(201).json(response);
      } catch (error) {
        if (error instanceof AppError) {
          res.status(error.HTTPStatus).json({ error: error.message });
          next(error);
        }
      }
    }
  );

  router.delete(
    '/:permissionId',
    async (req: RequestWithPermissionId, res, next) => {
      const permissionId = Number(req.params.permissionId);
      try {
        logger.info(
          `Permission API was called to delete one permission with id ${req.params.permissionId} from db`
        );
        if (Number.isNaN(permissionId) || Number(permissionId) < 1) {
          res
            .status(400)
            .send({ error: 'permissionId must be a valid number.' });
          return;
        }

        const response = await permissionUseCase.deletePermissionById(
          permissionId
        );

        if (!response) {
          res.status(404).json({ error: 'Permission not found' }).end();
          return;
        }

        res.status(204).end();
      } catch (error) {
        next(error);
      }
    }
  );

  expressApp.use('/api/permissions', router);
}
