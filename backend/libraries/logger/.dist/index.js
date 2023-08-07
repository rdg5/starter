"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _LoggerWrapper_instances, _a, _LoggerWrapper_underlyingLogger, _LoggerWrapper_getInitializeLogger, _LoggerWrapper_insertContextIntoMetadata;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LoggerWrapper = void 0;
const request_context_1 = require("@practica/request-context");
const pino_logger_1 = __importDefault(require("./pino.logger"));
class LoggerWrapper {
    constructor() {
        _LoggerWrapper_instances.add(this);
        _LoggerWrapper_underlyingLogger.set(this, null);
    }
    configureLogger(configuration, overrideIfExists = true) {
        if (__classPrivateFieldGet(this, _LoggerWrapper_underlyingLogger, "f") === null || overrideIfExists === true) {
            __classPrivateFieldSet(this, _LoggerWrapper_underlyingLogger, new pino_logger_1.default(configuration.level || 'info', configuration.prettyPrint || false), "f");
        }
    }
    resetLogger() {
        __classPrivateFieldSet(this, _LoggerWrapper_underlyingLogger, null, "f");
    }
    debug(message, metadata) {
        __classPrivateFieldGet(this, _LoggerWrapper_instances, "m", _LoggerWrapper_getInitializeLogger).call(this).debug(message, __classPrivateFieldGet(LoggerWrapper, _a, "m", _LoggerWrapper_insertContextIntoMetadata).call(LoggerWrapper, metadata));
    }
    error(message, metadata) {
        __classPrivateFieldGet(this, _LoggerWrapper_instances, "m", _LoggerWrapper_getInitializeLogger).call(this).error(message, __classPrivateFieldGet(LoggerWrapper, _a, "m", _LoggerWrapper_insertContextIntoMetadata).call(LoggerWrapper, metadata));
    }
    info(message, metadata) {
        __classPrivateFieldGet(this, _LoggerWrapper_instances, "m", _LoggerWrapper_getInitializeLogger).call(this).info(message, __classPrivateFieldGet(LoggerWrapper, _a, "m", _LoggerWrapper_insertContextIntoMetadata).call(LoggerWrapper, metadata));
    }
    warning(message, metadata) {
        __classPrivateFieldGet(this, _LoggerWrapper_instances, "m", _LoggerWrapper_getInitializeLogger).call(this).warning(message, __classPrivateFieldGet(LoggerWrapper, _a, "m", _LoggerWrapper_insertContextIntoMetadata).call(LoggerWrapper, metadata));
    }
}
exports.LoggerWrapper = LoggerWrapper;
_a = LoggerWrapper, _LoggerWrapper_underlyingLogger = new WeakMap(), _LoggerWrapper_instances = new WeakSet(), _LoggerWrapper_getInitializeLogger = function _LoggerWrapper_getInitializeLogger() {
    this.configureLogger({}, false);
    return __classPrivateFieldGet(this, _LoggerWrapper_underlyingLogger, "f");
}, _LoggerWrapper_insertContextIntoMetadata = function _LoggerWrapper_insertContextIntoMetadata(metadata) {
    const currentContext = (0, request_context_1.context)().getStore();
    if (currentContext == null) {
        return metadata;
    }
    if (metadata == null) {
        return currentContext;
    }
    return { ...currentContext, ...metadata };
};
exports.logger = new LoggerWrapper();
