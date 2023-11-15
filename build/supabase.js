"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.BDD = exports.randomString = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv = __importStar(require("dotenv"));
var crypto_1 = require("crypto");
function randomString() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var random;
    for (var i = 0; i < 32; i++) {
        random = (0, crypto_1.randomInt)(0, charactersLength);
        result += characters.charAt(random);
    }
    return result;
}
exports.randomString = randomString;
var supabase = /** @class */ (function () {
    function supabase() {
        dotenv.config();
        this.url = process.env.SUPABASE_URL;
        this.key = process.env.SUPABASE_KEY;
        //console.log(this.url, this.key)
        this.client = (0, supabase_js_1.createClient)(this.url, this.key);
    }
    supabase.prototype.getMangas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('mangas')
                            .select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getManga = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('mangas')
                            .select('*')
                            .match({ name_manga: name })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error || data.length === 0)
                            console.error(error);
                        //console.log(data)
                        // data?.forEach((e) => {
                        //     e.img = this.client.storage.from('mangas').createSignedUrl(e.img, 60 * 60 * 24)
                        // })
                        //console.log(data)
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getMangaById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('mangas')
                            .select('*')
                            .match({ id_manga: id })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.supprimerManga = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('mangas')
                            .delete()
                            .match({ name_manga: name })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.addManga = function (name, chap, page, image, synopsis) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('mangas')
                            .insert([
                            { name_manga: name, chapitre_manga: chap, page: page, img: image, synopsis: synopsis }
                        ])];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getChapitre = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('mangas')
                            .select('chapitre_manga')
                            .match({ name_manga: name })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.updateChapitre = function (name, chap) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('mangas')
                            .update({ chapitre_manga: chap })
                            .match({ name_manga: name })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.addUser = function (id, name, img) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('users')
                            .insert([
                            { id_user: id, name_user: name, pp: img }
                        ])];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('users')
                            .select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getUser = function (id_user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('users')
                            .select('*')
                            .match({ id_user: id_user })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getUserByName = function (name_user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('users')
                            .select('*')
                            .match({ name_user: name_user })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.supprimerUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('users')
                            .delete()
                            .match({ id_user: id })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.addLien = function (id_manga, id_user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('alerte')
                            .insert([
                            { id_manga: id_manga, id_user: id_user }
                        ])];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, { data: data, error: error }];
                }
            });
        });
    };
    supabase.prototype.getLien = function (id_manga) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('alerte')
                            .select('id_user')
                            .match({ id_manga: id_manga })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.verfiLien = function (id_user, id_manga) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('alerte')
                            .select('*')
                            .match({ id_user: id_user, id_manga: id_manga })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getLiens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('alerte')
                            .select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.supprimerLien = function (id_manga, id_user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('alerte')
                            .delete()
                            .match({ id_manga: id_manga, id_user: id_user })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.addToken = function (id_user) {
        return __awaiter(this, void 0, void 0, function () {
            var random, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        random = randomString();
                        return [4 /*yield*/, this.client
                                .from('token')
                                .insert([
                                { user_id: id_user, token: random }
                            ])
                            //if(error) console.error(error)
                        ];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        //if(error) console.error(error)
                        return [2 /*return*/, random];
                }
            });
        });
    };
    supabase.prototype.getUserByToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from('token')
                            .select('user_id')
                            .match({ token: token })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getMangasByToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .rpc('get_mangas_with_token', { token_string: token })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.addAlerteByToken = function (id_manga, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.getUserByToken(token).then(function (data) {
                    //console.log(data)
                    if ((data === null || data === void 0 ? void 0 : data.length) == 0)
                        return false;
                    _this.addLien(id_manga, data[0].user_id);
                });
                return [2 /*return*/];
            });
        });
    };
    supabase.prototype.suppAlerteByToken = function (id_manga, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.getUserByToken(token).then(function (data) {
                    //console.log(data)
                    if ((data === null || data === void 0 ? void 0 : data.length) == 0)
                        return false;
                    _this.supprimerLien(id_manga, data[0].user_id);
                });
                return [2 /*return*/];
            });
        });
    };
    supabase.prototype.getAlerteByToken = function (token, id_manga) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getUserByToken(token)];
                    case 1:
                        user = _b.sent();
                        if ((user === null || user === void 0 ? void 0 : user.length) == 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.client
                                .from('alerte')
                                .select('*')
                                .match({ id_user: user[0].user_id, id_manga: id_manga })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            console.error(error);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.verifTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .rpc('delete_old_tokens')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            console.error(error);
                        //else console.log(data)
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getUserInfo = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getUserByToken(token)];
                    case 1:
                        res = _b.sent();
                        if ((res === null || res === void 0 ? void 0 : res.length) == 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.client
                                .from('users')
                                .select('*')
                                .match({ id_user: res[0].user_id })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            console.error(error);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.getImgFromTest = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .storage
                            .from('test')
                            .createSignedUrl(name + '.png', 60 * 60 * 24)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            console.error(error);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.addImgToTest = function (name, img) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .storage
                            .from('test')
                            .upload(name, img, { contentType: 'image/png' })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            console.error(error);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    supabase.prototype.supImgFromTest = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.client
                            .storage
                            .from('test')
                            .remove([name + '.png'])];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            console.error(error);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return supabase;
}());
exports.BDD = new supabase();
// BDD.getImgFromTest().then((data) => {
//     console.log(data)
// })
// BDD.addToken("452370867758956554").then((data) => {
//     BDD.getUserByToken(data).then((data) => {
//         console.log(data)
//     })
// })
// BDD.verifTokens().then((data) => {
//     //console.log(data)
// })
