import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';
import { AppError } from '@practica/error-handling';
import { startWebServer, stopWebServer } from '../../entry-points/api/server';
import * as testHelpers from '../test-helpers';
import * as roleUseCase from '../../domain/role-use-case';

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

  nock('http://localhost/role/').get(`/1`).reply(200, {
    id: 1,
    name: 'Member',
  });
});

afterAll(async () => {
  nock.enableNetConnect();
  stopWebServer();
});

describe('/api/roles', () => {
  describe('GET /roles', () => {
    test('When asked for existing roles, Then should retrieve and receive 200 response along with existing fields', async () => {
      const getResponse = await axiosAPIClient.get(`/api/roles`);

      expect(getResponse).toMatchObject({
        status: 200,
      });

      expect(Array.isArray(getResponse.data)).toBeTruthy();

      getResponse.data.forEach((role) => {
        expect(role).toHaveProperty('id');
        expect(role).toHaveProperty('role');
      });
    });
  });

  test('When asked for existing roles, Then should retrieve them and receive 200 response ', async () => {
    const existingroles = [
      {
        id: 1,
        role: 'Admin',
      },
      {
        id: 2,
        role: 'Member',
      },
      {
        id: 3,
        role: 'Inspector',
      },
    ];

    const getResponse = await axiosAPIClient.get(`/api/roles`);

    expect(getResponse).toMatchObject({
      status: 200,
    });

    expect(getResponse.data).toMatchObject(existingroles);
  });
});

test('When asked for one specific role by id, Then should retrieve it and receive 200 response', async () => {
  const foundRole = { id: 1, role: 'Admin' };
  const getOneRoleResponse = await axiosAPIClient.get(`/api/users/1`);

  expect(getOneRoleResponse).toMatchObject({
    status: 200,
  });

  expect(getOneRoleResponse.data).toMatchObject(foundRole);
});

test('When asked for a non-existent role by id, Then should retrieve error and receive 404 response', async () => {
  const errorResponse = { error: 'Role not found' };
  const getNonExistentroleResponse = await axiosAPIClient.get(`/api/roles/999`);

  expect(getNonExistentroleResponse).toMatchObject({
    status: 404,
  });

  expect(getNonExistentroleResponse.data).toMatchObject(errorResponse);
});

test('When asked for a role by non-valid number id, Then should retrieve error and receive 400 response', async () => {
  const errorResponse = { error: 'roleId must be a valid number.' };
  const getNonExistentroleResponse = await axiosAPIClient.get(
    `/api/roles/-200`
  );

  expect(getNonExistentroleResponse).toMatchObject({
    status: 400,
  });

  expect(getNonExistentroleResponse.data).toMatchObject(errorResponse);
});

test('When role retrieval fails, then it should return status 404', async () => {
  const getrolesStub = sinon
    .stub(roleUseCase, 'getRoles')
    .returns(Promise.resolve(null));

  const postResponse = await axiosAPIClient.get(`/api/roles`);

  expect(postResponse.status).toBe(404);
});

test('When asked for a role by string instead of number as id, Then should retrieve error and receive 400 response', async () => {
  const errorResponse = { error: 'roleId must be a valid number.' };
  const getNonExistentroleResponse = await axiosAPIClient.get(
    `/api/roles/john`
  );

  expect(getNonExistentroleResponse).toMatchObject({
    status: 400,
  });

  expect(getNonExistentroleResponse.data).toMatchObject(errorResponse);
});

test('When error is thrown in get all roles, Then should pass the error to the next function', async () => {
  const mockError = new AppError('validation-failed', 'An error occurred', 500);
  const getrolesStub = sinon.stub(roleUseCase, 'getRoles').throws(mockError);

  try {
    await axiosAPIClient.get(`/api/roles`);
  } catch (error) {
    if (error instanceof AppError) {
      expect(error.HTTPStatus).toBe(mockError.HTTPStatus);
      expect(error.message).toEqual({ error: mockError.message });
    }
  }
});

test('When error is thrown in get one role, Then should pass the error to the next function', async () => {
  const mockError = new AppError('validation-failed', 'An error occurred', 500);
  const getoneroleStub = sinon
    .stub(roleUseCase, 'getRoleById')
    .throws(mockError);

  try {
    await axiosAPIClient.get(`/api/roles/999`);
  } catch (error) {
    if (error instanceof AppError) {
      expect(error.HTTPStatus).toBe(mockError.HTTPStatus);
      expect(error.message).toEqual({ error: mockError.message });
    }
  }
});

export {};
