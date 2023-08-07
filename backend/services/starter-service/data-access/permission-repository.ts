/* eslint-disable no-console */
import { Op } from 'sequelize';
import { getPermissionModel } from './models/permission-model';

type PermissionRecord = {
  id: number;
  ability: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
};

export async function getAllPermissions(): Promise<PermissionRecord[] | null> {
  try {
    const allPermissions = await getPermissionModel().findAll({
      attributes: ['id', 'ability'],
      raw: true,
    });
    return allPermissions;
  } catch (error) {
    console.error('Error in getAllpermissions:', error);
    throw error;
  }
}

export async function getPermissionByPermissionId(
  permissionId: number
): Promise<PermissionRecord | null> {
  try {
    const existingPermissionById = await getPermissionModel().findByPk(
      permissionId,
      {
        attributes: ['id', 'ability'],
      }
    );
    return existingPermissionById;
  } catch (error) {
    console.error('Error in getPermissionByRoleId:', error);
    throw error;
  }
}

export async function getpermissionByPermissionName(ability: string) {
  try {
    const existingPermission = await getPermissionModel().findOne({
      where: { ability },
    });
    return existingPermission;
  } catch (error) {
    console.error('Error in getPermissionByPermissionName:', error);
    throw error;
  }
}

export async function saveNewPermission(
  newPermissionData: Omit<PermissionRecord, 'id'>
): Promise<PermissionRecord | null> {
  try {
    const addedPermission = await getPermissionModel().create(
      newPermissionData,
      {
        attributes: ['id', 'ability'],
        raw: true,
      }
    );
    return addedPermission;
  } catch (error) {
    console.error('Error in saveNewPermission:', error);
    throw error;
  }
}

export async function updateExistingPermissionById(
  permissionId: number,
  permissionDetails
): Promise<PermissionRecord | null> {
  try {
    await getPermissionModel().update(permissionDetails, {
      where: { id: permissionId },
    });
    const updatedPermission = await getPermissionModel().findByPk(
      permissionId,
      {
        attributes: ['id', 'ability'],
        raw: true,
      }
    );
    return updatedPermission;
  } catch (error) {
    console.error('Error in updateExistingPermissionById', error);
    throw error;
  }
}

export async function updateExistingPermissionByPermissionName(
  permission: PermissionRecord
): Promise<PermissionRecord> {
  try {
    await getPermissionModel().update(
      { ability: permission.ability },
      { where: { id: permission.id } }
    );
    return permission;
  } catch (error) {
    console.error('Error in updateExistingPermissionByRoleName:', error);
    throw error;
  }
}

export async function deleteExistingPermission(
  permissionId: number
): Promise<PermissionRecord | null> {
  try {
    const permissionToBeDeleted = await getPermissionModel().findByPk(
      permissionId,
      {
        attributes: ['id', 'ability'],
        raw: true,
      }
    );
    await getPermissionModel().destroy({
      where: {
        id: permissionId,
      },
    });
    return permissionToBeDeleted;
  } catch (error) {
    console.error('Error in deleteExistingPermission', error);
    throw error;
  }
}
