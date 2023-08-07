/* eslint-disable no-console */
import { Op } from 'sequelize';
import { getRoleModel } from './models/role-model';

type RoleRecord = {
  id: number;
  role: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
};

export async function getAllRoles(): Promise<RoleRecord[] | null> {
  try {
    const allRoles = await getRoleModel().findAll({
      attributes: ['id', 'role'],
      raw: true,
    });
    return allRoles;
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    throw error;
  }
}

export async function getRoleByRoleId(
  roleId: number
): Promise<RoleRecord | null> {
  try {
    const existingRoleById = await getRoleModel().findByPk(roleId, {
      attributes: ['id', 'role'],
    });
    return existingRoleById;
  } catch (error) {
    console.error('Error in getRoleByRoleId:', error);
    throw error;
  }
}

export async function getRoleByRoleName(role: string) {
  try {
    const existingRole = await getRoleModel().findOne({
      where: { role },
    });
    console.log(existingRole);
    return existingRole;
  } catch (error) {
    console.error('Error in getRoleByRoleName:', error);
    throw error;
  }
}

export async function saveNewRole(
  newRoleData: Omit<RoleRecord, 'id'>
): Promise<RoleRecord | null> {
  try {
    const addedRole = await getRoleModel().create(newRoleData, {
      attributes: ['id', 'role'],
      raw: true,
    });
    return addedRole;
  } catch (error) {
    console.error('Error in saveNewRole:', error);
    throw error;
  }
}

export async function updateExistingRoleById(
  roleId: number,
  roleDetails
): Promise<RoleRecord | null> {
  try {
    await getRoleModel().update(roleDetails, {
      where: { id: roleId },
    });
    const updatedRole = await getRoleModel().findByPk(roleId, {
      attributes: ['id', 'role'],
      raw: true,
    });
    return updatedRole;
  } catch (error) {
    console.error('Error in updateExistingRoleById', error);
    throw error;
  }
}

export async function updateExistingRoleByRoleName(
  role: RoleRecord
): Promise<RoleRecord> {
  try {
    await getRoleModel().update(
      { role: role.role },
      { where: { id: role.id } }
    );
    return role;
  } catch (error) {
    console.error('Error in updateExistingRoleByRoleName:', error);
    throw error;
  }
}

export async function deleteExistingRole(
  roleId: number
): Promise<RoleRecord | null> {
  try {
    const roleToBeDeleted = await getRoleModel().findByPk(roleId, {
      attributes: ['id', 'role'],
      raw: true,
    });
    await getRoleModel().destroy({
      where: {
        id: roleId,
      },
    });
    return roleToBeDeleted;
  } catch (error) {
    console.error('Error in deleteExistingRole', error);
    throw error;
  }
}
