import express from 'express';
import { logger } from '@practica/logger';

export default function defineTeamRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.get('/haho', async (req, res, next) => {
    try {
      logger.info(`Hello API was called`);

      res.json('hello');
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/haho', router);
}
