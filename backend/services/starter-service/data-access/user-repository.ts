/* eslint-disable no-console */
import { Op } from 'sequelize';
import { getPermissionModel } from './models/permission-model';
import { getRoleModel } from './models/role-model';
import { getTeamModel } from './models/team-model';
import { getUserModel } from './models/user-model';

type UserRecord = {
  id: number;
  username: string;
  email: string;
  password: string;
  verifiedAt: number;
  verificationToken: string;
  verificationTokenExpiresAt: number;
  forgottenPasswordToken: string;
  forgottenPasswordTokenExpiresAt: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
};

export async function getAllUsers(): Promise<UserRecord[] | null> {
  try {
    const allUsers = await getUserModel().findAll({
      attributes: ['id', 'username', 'email'],
      raw: true,
    });
    return allUsers;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

export async function getUserByUserId(
  userId: number
): Promise<UserRecord | null> {
  try {
    const existingUserById = await getUserModel().findByPk(userId, {
      attributes: ['id', 'username', 'email'],
    });
    return existingUserById;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

export async function getAllUsersWithTeams(): Promise<UserRecord[] | null> {
  try {
    const allUsersWithTeams = await getUserModel().findAll({
      include: getTeamModel(),
    });
    return allUsersWithTeams;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

export async function getUserByUsernameOrEmailExceptCurrent(
  username: string,
  email: string,
  userId?: number
) {
  try {
    const conditions: any = {
      [Op.or]: [{ username }, { email }],
    };

    if (userId) {
      conditions[Op.and] = [{ id: { [Op.ne]: userId } }];
    }

    const existingUser = await getUserModel().findOne({
      where: conditions,
    });

    return existingUser;
  } catch (error) {
    console.error('Error in getUserByUsernameOrEmailExceptCurrent:', error);
    throw error;
  }
}

export async function getUserByUsernameOrEmail(
  username: string,
  email: string
) {
  try {
    const existingUser = await getUserModel().findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    return existingUser;
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    throw error;
  }
}

export async function getSoftDeletedUserByUsernameOrEmail(
  username: string,
  email: string
): Promise<UserRecord | null> {
  try {
    const user = await getUserModel().findOne({
      where: {
        [Op.or]: [{ username }, { email }],
        deletedAt: {
          [Op.ne]: null,
        },
      },
      raw: true,
    });
    return user;
  } catch (error) {
    console.error('Error in getSoftDeletedUserByUsernameOrEmail:', error);
    throw error;
  }
}

export async function saveNewUser(
  newUserData: Omit<UserRecord, 'id'>
): Promise<UserRecord | null> {
  try {
    const addedUser = await getUserModel().create(newUserData, {
      attributes: ['id', 'username', 'email'],
      raw: true,
    });
    return addedUser;
  } catch (error) {
    console.error('Error in saveNewUser:', error);
    throw error;
  }
}

export async function updateExistingUserById(
  userId: number,
  userDetails
): Promise<UserRecord | null> {
  try {
    await getUserModel().update(userDetails, {
      where: { id: userId },
    });
    const updatedUser = await getUserModel().findByPk(userId, {
      attributes: ['id', 'username', 'email'],
      raw: true,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error in updateExistingUser', error);
    throw error;
  }
}

export async function updateExistingUserByUser(
  user: UserRecord
): Promise<UserRecord> {
  try {
    await getUserModel().update(
      { username: user.username, email: user.email },
      { where: { id: user.id } }
    );
    return user;
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
}

export async function deleteExistingUser(
  userId: number
): Promise<UserRecord | null> {
  try {
    const userToBeDeleted = await getUserModel().findByPk(userId, {
      attributes: ['id', 'username', 'email'],
      raw: true,
    });
    await getUserModel().destroy({
      where: {
        id: userId,
      },
    });
    return userToBeDeleted;
  } catch (error) {
    console.error('Error in deleteExistingUser', error);
    throw error;
  }
}
