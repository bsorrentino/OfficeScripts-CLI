"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.loadOSTS = exports.chooseFile = exports.savePreferences = exports.askForPreferences = void 0;
var zx_1 = require("zx");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var util_1 = require("util");
var preferences_1 = __importDefault(require("preferences"));
var askForWebUrl = function (prefs) { return __awaiter(void 0, void 0, void 0, function () {
    var ask, isValid, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ask = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(prefs.weburl)) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, zx_1.question)("Web Url, default '" + prefs.weburl + "' type url or <enter> to confirm: ")];
                            case 1:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, (0, zx_1.question)("Web Url, type an valid url: ")
                                // console.log( 'answer', answer )
                            ];
                            case 3:
                                _a = _b.sent();
                                _b.label = 4;
                            case 4: return [2 /*return*/, _a];
                        }
                    });
                }); };
                isValid = function (url) { return url.trim().length > 0; };
                return [4 /*yield*/, ask()];
            case 1:
                answer = (_a.sent()).trim();
                if (answer.length === 0 && prefs.folder) {
                    return [2 /*return*/, prefs.weburl];
                }
                if (isValid(answer)) {
                    return [2 /*return*/, answer];
                }
                console.error("provided answer '" + answer + "' is not valid!");
                return [2 /*return*/];
        }
    });
}); };
var askForFolder = function (prefs) { return __awaiter(void 0, void 0, void 0, function () {
    var ask, isValid, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ask = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(prefs.folder)) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, zx_1.question)("Folder, default '" + prefs.folder + "' type url or <enter> to confirm: ")];
                            case 1:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, (0, zx_1.question)("Folder, type an valid folder path: ")
                                // console.log( 'answer', answer )
                            ];
                            case 3:
                                _a = _b.sent();
                                _b.label = 4;
                            case 4: return [2 /*return*/, _a];
                        }
                    });
                }); };
                isValid = function (url) { return url.trim().length > 0; };
                return [4 /*yield*/, ask()];
            case 1:
                answer = (_a.sent()).trim();
                if (answer.length === 0 && prefs.folder) {
                    return [2 /*return*/, prefs.folder];
                }
                if (isValid(answer)) {
                    return [2 /*return*/, answer];
                }
                console.error("provided answer '" + answer + "' is not valid!");
                return [2 /*return*/];
        }
    });
}); };
var _prefs = new preferences_1.default('org.bsc.officescripts-cli', {}, {
    encrypt: false
});
var askForPreferences = function () { return __awaiter(void 0, void 0, void 0, function () {
    var candidateWebUrl, candidateFolder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, askForWebUrl(_prefs)];
            case 1:
                candidateWebUrl = _a.sent();
                if (!candidateWebUrl)
                    return [2 /*return*/];
                return [4 /*yield*/, askForFolder(_prefs)];
            case 2:
                candidateFolder = _a.sent();
                if (!candidateFolder)
                    return [2 /*return*/];
                return [2 /*return*/, { weburl: candidateWebUrl, folder: candidateFolder }];
        }
    });
}); };
exports.askForPreferences = askForPreferences;
var savePreferences = function (data) {
    _prefs.weburl = data.weburl;
    _prefs.folder = data.folder;
};
exports.savePreferences = savePreferences;
var chooseFile = function (files, print) { return __awaiter(void 0, void 0, void 0, function () {
    var choice, answer, index, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files.forEach(function (file, index) {
                    return console.log(index + 1 + ") " + print(file));
                });
                choice = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(files.length === 1)) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, zx_1.question)("choose file, default 1: ")];
                            case 1:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, (0, zx_1.question)("choose file [1-" + files.length + "], default 1: ")];
                            case 3:
                                _a = _b.sent();
                                _b.label = 4;
                            case 4: return [2 /*return*/, _a];
                        }
                    });
                }); };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, choice()];
            case 2:
                answer = (_a.sent()).trim();
                if (answer.length === 0) {
                    return [2 /*return*/, files[0]];
                }
                index = Number(answer);
                if (index >= 1 && index < files.length) {
                    return [2 /*return*/, files[index - 1]];
                }
                console.error("invalid range");
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error("invalid number");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.chooseFile = chooseFile;
var fsreadFile = (0, util_1.promisify)(fs.readFile);
function loadOSTS(filePath, bodyDirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var content, osts, bodyFilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsreadFile(filePath)];
                case 1:
                    content = _a.sent();
                    osts = JSON.parse(content.toString());
                    bodyFilePath = path.join(bodyDirPath, path.basename(filePath, '.osts') + "_" + osts.version + ".ts");
                    return [2 /*return*/, __assign({ bodyFilePath: bodyFilePath }, osts)];
            }
        });
    });
}
exports.loadOSTS = loadOSTS;
