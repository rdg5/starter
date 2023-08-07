import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';
import { AppError } from '@practica/error-handling';
import { startWebServer, stopWebServer } from '../../entry-points/api/server';
import * as testHelpers from '../test-helpers';
import * as userUseCase from '../../domain/user-use-case';

let axiosAPIClient;

beforeAll(async () => {
  process.env.JWT_TOKEN_SECRET = testHelpers.exampleSecret;
  const apiConnection = await startWebServer();
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true,
    headers: {
      authorization: testHelpers.signValidTokenWithDefaultUser(),
    },
  };
  axiosAPIClient = axios.create(axiosConfig);

  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

beforeEach(() => {
  nock.cleanAll();
  sinon.restore();

  nock('http://localhost/user/').get(`/1`).reply(200, {
    id: 1,
    name: 'John',
    terms: 45,
  });
});

afterAll(async () => {
  nock.enableNetConnect();
  stopWebServer();
});

describe('/api/roles', () => {
  describe('GET /users', () => {
    test('When asked for existing users, Then should retrieve and receive 200 response along with existing fields', async () => {
      const getResponse = await axiosAPIClient.get(`/api/users`);

      expect(getResponse).toMatchObject({
        status: 200,
      });

      expect(Array.isArray(getResponse.data)).toBeTruthy();

      getResponse.data.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('email');
      });
    });
  });

  test('When asked for existing users, Then should retrieve them and receive 200 response ', async () => {
    const existingUsers = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
      },
      {
        id: 2,
        username: 'user2',
        email: 'user2@example.com',
      },
      {
        id: 3,
        username: 'user3',
        email: 'user3@example.com',
      },
    ];

    const getResponse = await axiosAPIClient.get(`/api/users`);

    expect(getResponse).toMatchObject({
      status: 200,
    });

    expect(getResponse.data).toMatchObject(existingUsers);
  });
});

test('When asked for one specific user by id, Then should retrieve it and receive 200 response', async () => {
  const foundUser = { id: 1, username: 'user1', email: 'user1@example.com' };
  const getOneUserResponse = await axiosAPIClient.get(`/api/users/1`);

  expect(getOneUserResponse).toMatchObject({
    status: 200,
  });

  expect(getOneUserResponse.data).toMatchObject(foundUser);
});

test('When asked for a non-existent user by id, Then should retrieve error and receive 404 response', async () => {
  const errorResponse = { error: 'User not found' };
  const getNonExistentUserResponse = await axiosAPIClient.get(`/api/users/999`);

  expect(getNonExistentUserResponse).toMatchObject({
    status: 404,
  });

  expect(getNonExistentUserResponse.data).toMatchObject(errorResponse);
});

test('When asked for a user by non-valid number id, Then should retrieve error and receive 400 response', async () => {
  const errorResponse = { error: 'userId must be a valid number.' };
  const getNonExistentUserResponse = await axiosAPIClient.get(
    `/api/users/-200`
  );

  expect(getNonExistentUserResponse).toMatchObject({
    status: 400,
  });

  expect(getNonExistentUserResponse.data).toMatchObject(errorResponse);
});

test('When user retrieval fails, then it should return status 404', async () => {
  const getUsersStub = sinon
    .stub(userUseCase, 'getUsers')
    .returns(Promise.resolve(null));

  const postResponse = await axiosAPIClient.get(`/api/users`);

  expect(postResponse.status).toBe(404);
});

test('When asked for a user by string instead of number as id, Then should retrieve error and receive 400 response', async () => {
  const errorResponse = { error: 'userId must be a valid number.' };
  const getNonExistentUserResponse = await axiosAPIClient.get(
    `/api/users/john`
  );

  expect(getNonExistentUserResponse).toMatchObject({
    status: 400,
  });

  expect(getNonExistentUserResponse.data).toMatchObject(errorResponse);
});

test('When error is thrown in get all users, Then should pass the error to the next function', async () => {
  const mockError = new AppError('validation-failed', 'An error occurred', 500);
  const getUsersStub = sinon.stub(userUseCase, 'getUsers').throws(mockError);

  try {
    await axiosAPIClient.get(`/api/users`);
  } catch (error) {
    if (error instanceof AppError) {
      expect(error.HTTPStatus).toBe(mockError.HTTPStatus);
      expect(error.message).toEqual({ error: mockError.message });
    }
  }
});

test('When error is thrown in get one user, Then should pass the error to the next function', async () => {
  const mockError = new AppError('validation-failed', 'An error occurred', 500);
  const getoneUserStub = sinon
    .stub(userUseCase, 'getUserById')
    .throws(mockError);

  try {
    await axiosAPIClient.get(`/api/users/999`);
  } catch (error) {
    if (error instanceof AppError) {
      expect(error.HTTPStatus).toBe(mockError.HTTPStatus);
      expect(error.message).toEqual({ error: mockError.message });
    }
  }
});

export {};
