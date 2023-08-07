import { Request } from 'express';

export interface RequestWithUserId extends Request {
  params: {
    userId: string;
  };
}
