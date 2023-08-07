import express from 'express';
import { logger } from '@practica/logger';
import { AppError } from '@practica/error-handling';
import * as userUseCase from '../../domain/user-use-case';
import { RequestWithUserId } from './userInterfaces';

export default function defineUserRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info(`User API was called to get all users from db`);
      const response = await userUseCase.getUsers();

      if (!response) {
        res.status(404).end();
        return;
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:userId', async (req: RequestWithUserId, res, next) => {
    const userId = Number(req.params.userId);
    try {
      logger.info(
        `User API was called to get one user with id ${req.params.userId} from db`
      );
      if (Number.isNaN(userId) || Number(userId) < 1) {
        res.status(400).send({ error: 'userId must be a valid number.' });
        return;
      }

      const response = await userUseCase.getUserById(userId);

      if (!response) {
        res.status(404).json({ error: 'User not found' }).end();
        return;
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      logger.info(`User API was called to create a new user in the db`);
      const response = await userUseCase.createNewUser(req.body);

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

  router.patch('/:userId', async (req: RequestWithUserId, res, next) => {
    const userId = Number(req.params.userId);
    try {
      logger.info(
        `User API was called to edit user with id ${req.params.userId} from db`
      );

      if (Number.isNaN(userId) || Number(userId) < 1) {
        res.status(400).send({ error: 'userId must be a valid number.' });
        return;
      }

      const response = await userUseCase.editExistingUser(userId, req.body);

      if (!response) {
        res.status(404).json({ error: 'User not found' }).end();
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

  router.delete('/:userId', async (req: RequestWithUserId, res, next) => {
    const userId = Number(req.params.userId);
    try {
      logger.info(
        `Order API was called to get one user with id ${req.params.userId} from db`
      );
      if (Number.isNaN(userId) || Number(userId) < 1) {
        res.status(400).send({ error: 'userId must be a valid number.' });
        return;
      }

      const response = await userUseCase.deleteUserById(userId);

      if (!response) {
        res.status(404).json({ error: 'User not found' }).end();
        return;
      }

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/api/users', router);
}
