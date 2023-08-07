import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';
import { startWebServer, stopWebServer } from '../../entry-points/api/server';
import * as testHelpers from '../test-helpers';
import * as createNewUser from '../../domain/user-use-case';

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

describe('/api', () => {
  describe('POST /users', () => {
    test('When asked to save a new user, Then it saves it and returns the newly created user', async () => {
      const newUserToBeCreated = {
        username: 'newUser1',
        email: 'newUser1@example.com',
        password: 'password123',
      };
      const createdNewUser = {
        username: 'newUser1',
        email: 'newUser1@example.com',
      };

      const postResponse = await axiosAPIClient.post(
        `/api/users`,
        newUserToBeCreated
      );

      expect(postResponse.status).toBe(201);

      expect(postResponse.data).toHaveProperty('id');
      expect(typeof postResponse.data.id).toBe('number');

      const newUserId = postResponse.data.id;

      const getResponse = await axiosAPIClient.get(`/api/users/${newUserId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toMatchObject({
        ...createdNewUser,
        id: newUserId,
      });
    });

    test('When asked to save a new user with already existing username, Then it returns an error with status 409', async () => {
      const newUserToBeCreated = {
        username: 'newUser1',
        email: 'newUser1@example.com',
        password: 'password123',
      };
      const postResponse = await axiosAPIClient.post(
        `/api/users`,
        newUserToBeCreated
      );

      expect(postResponse.status).toBe(409);

      expect(postResponse.data).toHaveProperty('error');
      expect(typeof postResponse.data.error).toBe('string');
      expect(postResponse.data.error).toBe('Username already in use');
    });

    test('When asked to save a new user with already existing email, Then it returns an error with status 409', async () => {
      const newUserToBeCreated = {
        username: 'newUser999',
        email: 'newUser1@example.com',
        password: 'password123',
      };
      const postResponse = await axiosAPIClient.post(
        `/api/users`,
        newUserToBeCreated
      );

      expect(postResponse.status).toBe(409);

      expect(postResponse.data).toHaveProperty('error');
      expect(typeof postResponse.data.error).toBe('string');
      expect(postResponse.data.error).toBe('Email already in use');
    });

    test('When user creation fails, then it should return status 404', async () => {
      const createNewUserStub = sinon
        .stub(createNewUser, 'createNewUser')
        .returns(Promise.resolve(null));
      const newUserToBeCreated = {
        username: 'newUser999',
        email: 'newUser1@example.com',
        password: 'password123',
      };

      const postResponse = await axiosAPIClient.post(
        `/api/users`,
        newUserToBeCreated
      );

      expect(postResponse.status).toBe(404);
    });
  });
});
export {};
