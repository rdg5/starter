import { Request } from 'express';

export interface RequestWithRoleId extends Request {
  params: {
    roleId: string;
  };
}
