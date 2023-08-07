import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';
import { startWebServer, stopWebServer } from '../../entry-points/api/server';
import * as testHelpers from '../test-helpers';
import * as createNewrole from '../../domain/role-use-case';

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
    role: 'Member',
  });
});

afterAll(async () => {
  nock.enableNetConnect();
  stopWebServer();
});

describe('/api', () => {
  describe('POST /roles', () => {
    test('When asked to save a new role, Then it saves it and returns the newly created user', async () => {
      const newroleToBeCreated = {
        role: 'Inspector',
      };
      const createdNewrole = {
        role: 'Inspector',
      };

      const postResponse = await axiosAPIClient.post(
        `/api/roles`,
        newroleToBeCreated
      );

      expect(postResponse.status).toBe(201);

      expect(postResponse.data).toHaveProperty('id');
      expect(typeof postResponse.data.id).toBe('number');

      const newroleId = postResponse.data.id;

      const getResponse = await axiosAPIClient.get(`/api/roles/${newroleId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toMatchObject({
        ...createdNewrole,
        id: newroleId,
      });
    });

    test('When asked to save a new role with already existing username, Then it returns an error with status 409', async () => {
      const newroleToBeCreated = {
        role: 'Member',
      };
      const postResponse = await axiosAPIClient.post(
        `/api/roles`,
        newroleToBeCreated
      );

      expect(postResponse.status).toBe(409);

      expect(postResponse.data).toHaveProperty('error');
      expect(typeof postResponse.data.error).toBe('string');
      expect(postResponse.data.error).toBe('Role already exists');
    });

    test('When role creation fails, then it should return status 404', async () => {
      const createNewrolestub = sinon
        .stub(createNewrole, 'createNewRole')
        .returns(Promise.resolve(null));
      const newroleToBeCreated = {
        role: 'Inspector',
      };

      const postResponse = await axiosAPIClient.post(
        `/api/roles`,
        newroleToBeCreated
      );

      expect(postResponse.status).toBe(404);
    });
  });
});
export {};
