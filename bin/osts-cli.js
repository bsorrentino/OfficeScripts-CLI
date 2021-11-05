"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var minimist_1 = __importDefault(require("minimist"));
var process_1 = require("process");
var osts_pack_1 = require("./osts-pack");
var osts_unpack_1 = require("./osts-unpack");
var DEFAULT_PATH = 'osts';
function help() {
    console.log("\nUsage:\n========\n\nosts unpack [--path, -p <dest dir>] // download OSTS package and extract body (.ts) to dest dir (default '" + DEFAULT_PATH + "')\n\nosts pack [--path, -p <src dir>] // package source (.ts) in src dir (default '" + DEFAULT_PATH + "') to OSTS package and upload it\n");
}
// Evaluate command
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var cli, _cmd, _path, code, code, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cli = (0, minimist_1.default)(process.argv.slice(2), {
                    '--': false,
                    string: 'path',
                    alias: { 'p': 'path' },
                    'default': { 'path': DEFAULT_PATH },
                    unknown: function (args) { return args.toLowerCase() === 'pack' || args.toLowerCase() === 'unpack'; }
                });
                _cmd = function () {
                    return (cli._.length > 0) ? cli._[0].toLowerCase() : undefined;
                };
                _path = function () { var _a; return ((_a = cli['path']) === null || _a === void 0 ? void 0 : _a.length) === 0 ? DEFAULT_PATH : cli.path; };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                if (!(_cmd() === 'pack')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, osts_pack_1.pack)(_path())];
            case 2:
                code = _a.sent();
                (0, process_1.exit)(code);
                return [3 /*break*/, 6];
            case 3:
                if (!(_cmd() === 'unpack')) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, osts_unpack_1.unpack)(_path())];
            case 4:
                code = _a.sent();
                (0, process_1.exit)(code);
                return [3 /*break*/, 6];
            case 5:
                help();
                (0, process_1.exit)(0);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_1 = _a.sent();
                console.error('error occurred!', e_1);
                (0, process_1.exit)(-1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); })();
