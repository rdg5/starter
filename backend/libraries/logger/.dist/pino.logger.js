"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PinoLogger_logger;
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = require("pino");
class PinoLogger {
    constructor(level, prettyPrintEnabled, destStream) {
        this.level = level;
        this.prettyPrintEnabled = prettyPrintEnabled;
        this.destStream = destStream;
        _PinoLogger_logger.set(this, void 0);
        __classPrivateFieldSet(this, _PinoLogger_logger, (0, pino_1.pino)({
            level,
            transport: prettyPrintEnabled
                ? {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        sync: true,
                    },
                }
                : undefined,
        }), "f");
    }
    debug(message, metadata) {
        if (metadata) {
            __classPrivateFieldGet(this, _PinoLogger_logger, "f").debug(metadata, message);
        }
        else {
            __classPrivateFieldGet(this, _PinoLogger_logger, "f").debug(message);
        }
    }
    error(message, metadata) {
        if (metadata) {
            __classPrivateFieldGet(this, _PinoLogger_logger, "f").error(metadata, message);
        }
        else {
            __classPrivateFieldGet(this, _PinoLogger_logger, "f").error(message);
        }
    }
    info(message, metadata) {
        if (metadata) {
            __classPrivateFieldGet(this, _PinoLogger_logger, "f").info(metadata, message);
        }
        else {
            __classPrivateFieldGet(this, _PinoLogger_logger, "f").info(message);
        }
    }
    warning(message, metadata) {
        if (metadata) {
            __classPrivateFieldGet(this, _PinoLogger_logger, "f").warn(metadata, message);
        }
        else {
            __classPrivateFieldGet(this, _PinoLogger_logger, "f").warn(message);
        }
    }
}
exports.default = PinoLogger;
_PinoLogger_logger = new WeakMap();
