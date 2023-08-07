/* eslint-disable no-console */
import ajv from '@practica/validation/ajv-cache';
import { v4 as uuidv4 } from 'uuid';

import { AppError } from '@practica/error-handling';
import * as permissionRepository from '../data-access/permission-repository';
import {
  addPermissionDTO,
  editPermissionDTO,
  editPermissionSchema,
  permissionSchema,
} from './permission-schema';

export async function getAllpermissions() {
  return await permissionRepository.getAllPermissions();
}

export async function getPermissionById(permissionId: number) {
  return await permissionRepository.getPermissionByPermissionId(permissionId);
}

export async function createNewPermission(requestBody) {
  assertPermissionIsValid(requestBody);
  await asserPermissionToBeCreatedOrEditedIsUnique(requestBody);

  return await permissionRepository.saveNewPermission(requestBody);
}

export async function editExistingPermission(
  permissionId: number,
  requestBody
) {
  assertEditingPermissionIsValid(requestBody);
  await asserPermissionToBeCreatedOrEditedIsUnique(requestBody, permissionId);
  return await permissionRepository.updateExistingPermissionById(
    permissionId,
    requestBody
  );
}

export async function deletePermissionById(permissionId: number) {
  const permissionExistsforDeletion =
    await permissionRepository.getPermissionByPermissionId(permissionId);
  if (permissionExistsforDeletion) {
    permissionExistsforDeletion.ability += `-${uuidv4()}`;
    await permissionRepository.updateExistingPermissionByPermissionName(
      permissionExistsforDeletion
    );
  }
  await permissionRepository.deleteExistingPermission(permissionId);
  return permissionExistsforDeletion;
}

async function asserPermissionToBeCreatedOrEditedIsUnique(
  requestBody: addPermissionDTO,
  permissionId?: number
) {
  const { ability } = requestBody;
  const alreadyExistingpermission =
    await permissionRepository.getpermissionByPermissionName(ability);

  if (alreadyExistingpermission !== null) {
    throw new AppError(
      'validation-failed',
      `permission already exists`,
      409,
      true
    );
  }
}

function assertPermissionIsValid(permissionToBeCreated: addPermissionDTO) {
  const isValid = ajv.validate(permissionSchema, permissionToBeCreated);
  if (isValid === false) {
    throw new AppError(
      'invalid-permission-creation',
      `Validation failed`,
      400,
      true
    );
  }
}

function assertEditingPermissionIsValid(
  permissionToBeEdited: editPermissionDTO
) {
  const isValid = ajv.validate(editPermissionSchema, permissionToBeEdited);
  if (isValid === false) {
    throw new AppError(
      'invalid-permission-editing',
      `Validation failed`,
      400,
      true
    );
  }
}
