"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const request_context_1 = require("@practica/request-context");
const index_1 = require("../index");
describe('logger', () => {
    beforeEach(() => {
        sinon_1.default.restore();
        index_1.logger.resetLogger();
    });
    test('When no explicit configuration is set, info logs are written', async () => {
        const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
        index_1.logger.info('This is an info message');
        expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
            stdCallCount: 1,
        });
        const lastStdoutCall = JSON.parse(stdoutStub.lastCall.firstArg);
        expect(lastStdoutCall).toMatchObject({ msg: 'This is an info message' });
    });
    test('When log level is DEBUG and logger emits INFO statement, then stdout contains the entry', async () => {
        const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
        index_1.logger.configureLogger({ level: 'debug' }, true);
        index_1.logger.info('This is an info message');
        expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
            stdCallCount: 1,
        });
        const lastStdoutCall = JSON.parse(stdoutStub.lastCall.firstArg);
        expect(lastStdoutCall).toMatchObject({ msg: 'This is an info message' });
    });
    test('When logger is configured and then re-configured, then the new config applies', async () => {
        const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
        index_1.logger.configureLogger({ level: 'info' }, true);
        index_1.logger.configureLogger({ level: 'debug' }, true);
        index_1.logger.debug('This is an info message');
        expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
            stdCallCount: 1,
        });
        const lastStdoutCall = JSON.parse(stdoutStub.lastCall.firstArg);
        expect(lastStdoutCall).toMatchObject({ msg: 'This is an info message' });
    });
    test('When log level is ERROR and logger emits INFO statement, then nothing is written', async () => {
        const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
        index_1.logger.configureLogger({ level: 'error' }, true);
        index_1.logger.info('This is an info message');
        expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
            stdCallCount: 0,
        });
    });
    test('When configuring for pretty-print, then its written to stdout', async () => {
        const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
        index_1.logger.configureLogger({ level: 'info', prettyPrint: false }, true);
        index_1.logger.info('This is an info message');
        expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
            stdCallCount: 1,
        });
    });
    test('it should print the passed metadata', async () => {
        const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
        index_1.logger.configureLogger({ level: 'info' }, true);
        const objectToPrint = { custom: 'I love you 3000' };
        index_1.logger.info('This is an info message', objectToPrint);
        expect(stdoutStub.callCount).toEqual(1);
        const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg);
        expect(lastStdoutCall).toMatchObject({
            msg: 'This is an info message',
            ...objectToPrint,
        });
    });
    describe('context', () => {
        test('it should print the current context', () => {
            const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
            const currentContext = {
                requestId: 'my-request-id',
            };
            (0, request_context_1.context)().run(currentContext, () => {
                index_1.logger.info('This is an info message');
            });
            expect(stdoutStub.callCount).toEqual(1);
            const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg);
            expect(lastStdoutCall).toMatchObject({
                ...currentContext,
                msg: 'This is an info message',
            });
        });
        test('it should merge with current context', () => {
            const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
            const currentContext = {
                requestId: 'my-request-id',
            };
            (0, request_context_1.context)().run(currentContext, () => {
                index_1.logger.info('This is an info message', { userId: 1 });
            });
            expect(stdoutStub.callCount).toEqual(1);
            const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg);
            expect(lastStdoutCall).toMatchObject({
                ...currentContext,
                msg: 'This is an info message',
                userId: 1,
            });
        });
        test('it should override current context', () => {
            const stdoutStub = sinon_1.default.stub(process.stdout, 'write');
            const currentContext = {
                requestId: 'my-request-id',
                userId: 1,
            };
            (0, request_context_1.context)().run(currentContext, () => {
                index_1.logger.info('This is an info message', { userId: 2 });
            });
            expect(stdoutStub.callCount).toEqual(1);
            const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg);
            expect(lastStdoutCall).toMatchObject({
                msg: 'This is an info message',
                requestId: 'my-request-id',
                userId: 2,
            });
        });
    });
});
