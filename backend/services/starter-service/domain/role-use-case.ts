/* eslint-disable no-console */
import ajv from '@practica/validation/ajv-cache';
import { v4 as uuidv4 } from 'uuid';

import { AppError } from '@practica/error-handling';
import * as roleRepository from '../data-access/role-repository';
import {
  addRoleDTO,
  editRoleDTO,
  editRoleSchema,
  roleSchema,
} from './role-schema';

export async function getRoles() {
  return await roleRepository.getAllRoles();
}

export async function getRoleById(roleId: number) {
  return await roleRepository.getRoleByRoleId(roleId);
}

export async function createNewRole(requestBody) {
  assertRoleIsValid(requestBody);
  await assertRoleToBeCreatedorEditedIsUnique(requestBody);

  return await roleRepository.saveNewRole(requestBody);
}

export async function editExistingRole(roleId: number, requestBody) {
  assertEditingRoleIsValid(requestBody);
  await assertRoleToBeCreatedorEditedIsUnique(requestBody, roleId);
  return await roleRepository.updateExistingRoleById(roleId, requestBody);
}

export async function deleteRoleById(roleId: number) {
  const roleExistsforDeletion = await roleRepository.getRoleByRoleId(roleId);
  if (roleExistsforDeletion) {
    roleExistsforDeletion.role += `-${uuidv4()}`;
    await roleRepository.updateExistingRoleByRoleName(roleExistsforDeletion);
  }
  await roleRepository.deleteExistingRole(roleId);
  return roleExistsforDeletion;
}

async function assertRoleToBeCreatedorEditedIsUnique(
  requestBody: addRoleDTO,
  roleId?: number
) {
  const { role } = requestBody;
  const alreadyExistingRole = await roleRepository.getRoleByRoleName(role);

  if (alreadyExistingRole !== null) {
    throw new AppError('validation-failed', `Role already exists`, 409, true);
  }
}

function assertRoleIsValid(roleToBeCreated: addRoleDTO) {
  const isValid = ajv.validate(roleSchema, roleToBeCreated);
  if (isValid === false) {
    throw new AppError('invalid-role-creation', `Validation failed`, 400, true);
  }
}

function assertEditingRoleIsValid(roleToBeEdited: editRoleDTO) {
  const isValid = ajv.validate(editRoleSchema, roleToBeEdited);
  if (isValid === false) {
    throw new AppError('invalid-role-editing', `Validation failed`, 400, true);
  }
}
