import { Request } from 'express';

export interface RequestWithPermissionId extends Request {
  params: {
    permissionId: string;
  };
}
