/* eslint-disable no-console */
import ajv from '@practica/validation/ajv-cache';
import { v4 as uuidv4 } from 'uuid';

import { AppError } from '@practica/error-handling';
import * as userRepository from '../data-access/user-repository';
import {
  addUserDTO,
  editUserDTO,
  editUserSchema,
  userSchema,
} from './user-schema';

export async function getUsers() {
  return await userRepository.getAllUsers();
}

export async function getUserById(userId: number) {
  return await userRepository.getUserByUserId(userId);
}

export async function getUsersWithTeams() {
  return await userRepository.getAllUsersWithTeams();
}

export async function createNewUser(requestBody) {
  assertUserIsValid(requestBody);
  await assertEmailAndUsernameAreUnique(requestBody);

  return await userRepository.saveNewUser(requestBody);
}

export async function editExistingUser(userId: number, requestBody) {
  assertEditingUserIsValid(requestBody);
  await assertEmailAndUsernameAreUnique(requestBody, userId);
  return await userRepository.updateExistingUserById(userId, requestBody);
}

export async function deleteUserById(userId: number) {
  const userExistsforDeletion = await userRepository.getUserByUserId(userId);
  if (userExistsforDeletion) {
    userExistsforDeletion.username += `-${uuidv4()}`;
    userExistsforDeletion.email += `-${uuidv4()}`;

    await userRepository.updateExistingUserByUser(userExistsforDeletion);
  }
  await userRepository.deleteExistingUser(userId);
  return userExistsforDeletion;
}

async function assertEmailAndUsernameAreUnique(
  requestBody: addUserDTO,
  userId?: number
) {
  const { username, email } = requestBody;
  const alreadyExistingUser =
    await userRepository.getUserByUsernameOrEmailExceptCurrent(
      username,
      email,
      userId
    );

  if (alreadyExistingUser !== null) {
    const { username: existingUsername, email: existingEmail } =
      alreadyExistingUser;

    if (existingUsername === username) {
      throw new AppError(
        'validation-failed',
        `Username already in use`,
        409,
        true
      );
    }
    if (existingEmail === email) {
      throw new AppError(
        'validation-failed',
        `Email already in use`,
        409,
        true
      );
    }
  }
}

function assertUserIsValid(userToBeCreated: addUserDTO) {
  const isValid = ajv.validate(userSchema, userToBeCreated);
  if (isValid === false) {
    throw new AppError('invalid-user-creation', `Validation failed`, 400, true);
  }
}

function assertEditingUserIsValid(userToBeEdited: editUserDTO) {
  const isValid = ajv.validate(editUserSchema, userToBeEdited);
  if (isValid === false) {
    throw new AppError('invalid-user-editing', `Validation failed`, 400, true);
  }
}
