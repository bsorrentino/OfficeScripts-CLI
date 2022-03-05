"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pack = void 0;
require("zx/globals");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var util_1 = require("util");
var osts_utils_1 = require("./osts-utils");
var fsreadFile = (0, util_1.promisify)(fs.readFile);
var fswriteFile = (0, util_1.promisify)(fs.writeFile);
var fsreaddir = (0, util_1.promisify)(fs.readdir);
var askForConfirmUpload = function () { return __awaiter(void 0, void 0, void 0, function () {
    var answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, question('do you want upload file? (Y/n): ')];
            case 1:
                answer = (_a.sent())
                    .trim()
                    .toLowerCase();
                if (answer.length === 0 || answer === 'y')
                    return [2 /*return*/, true];
                return [2 /*return*/, false];
        }
    });
}); };
function pack(bodyDirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var osts_files, selectedFile, osts, body_source, upload, prefs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsreaddir('.')];
                case 1:
                    osts_files = (_a.sent())
                        .filter(function (n) { return path.extname(n) === '.osts'; });
                    return [4 /*yield*/, (0, osts_utils_1.chooseFile)(osts_files, function (file) { return file; })];
                case 2:
                    selectedFile = _a.sent();
                    if (!selectedFile) {
                        return [2 /*return*/, -1];
                    }
                    return [4 /*yield*/, (0, osts_utils_1.loadOSTS)(selectedFile, bodyDirPath)];
                case 3:
                    osts = _a.sent();
                    return [4 /*yield*/, fsreadFile(osts.bodyFilePath)];
                case 4:
                    body_source = _a.sent();
                    osts.body = body_source.toString();
                    return [4 /*yield*/, fswriteFile(selectedFile, JSON.stringify(osts))];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, askForConfirmUpload()];
                case 6:
                    upload = _a.sent();
                    if (!upload)
                        return [2 /*return*/, 1];
                    return [4 /*yield*/, (0, osts_utils_1.askForPreferences)()];
                case 7:
                    prefs = _a.sent();
                    if (!prefs)
                        return [2 /*return*/, 1];
                    return [4 /*yield*/, $(templateObject_1 || (templateObject_1 = __makeTemplateObject(["m365 spo file add  --webUrl ", " --folder ", " --path ", ""], ["m365 spo file add  --webUrl ", " --folder ", " --path ", ""])), prefs.weburl, prefs.folder, selectedFile)];
                case 8:
                    _a.sent();
                    (0, osts_utils_1.savePreferences)(prefs);
                    return [2 /*return*/, 0];
            }
        });
    });
}
exports.pack = pack;
var templateObject_1;
