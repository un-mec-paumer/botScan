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
exports.downloadImg = exports.sauvegarder = exports.finderAll = void 0;
var fs_1 = require("fs");
// import mangas from "./data/mangas.json";
var supabase_1 = require("./supabase");
var urlBase = "https://fr-scan.com/manga/";
function finder(manga) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, text, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "";
                    // let url2: string = "";
                    if (!manga.page)
                        url = urlBase + manga.name_manga + "/chapitre-" + manga.chapitre_manga + "-vf/";
                    else
                        url = urlBase + manga.name_manga + "/chapitre-" + manga.chapitre_manga + "-vf/p/100000";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'text/html',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 3:
                    text = _a.sent();
                    console.log(text);
                    //console.log(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga) + "-vf/", text.includes(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/"));
                    return [2 /*return*/, text.includes(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/")];
                case 4:
                    error_1 = _a.sent();
                    console.log("veux pas");
                    console.error('Error:', error_1);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function finderAll(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("finderAll");
            //const userID = "452370867758956554";
            supabase_1.BDD.getMangas().then(function (mangas) {
                mangas.forEach(function (manga) {
                    //console.log(manga);
                    finder(manga).then(function (value) {
                        //console.log(value);
                        if (value) {
                            supabase_1.BDD.updateChapitre(manga.name_manga, manga.chapitre_manga + 1).then(function () {
                                supabase_1.BDD.getLien(manga.id_manga).then(function (userID) {
                                    userID.forEach(function (user) {
                                        client.users.fetch(user.id_user).then(function (user) {
                                            user.send("Le chapitre " + (manga.chapitre_manga + 1) + " de " + manga.name_manga + " est sorti !");
                                            user.send(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/");
                                        });
                                    });
                                });
                            });
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.finderAll = finderAll;
function sauvegarder(data /*, path:PathOrFileDescriptor*/) {
    //console.log("data ", data);
    //let str = JSON.stringify(data);
    var path2 = "./src/data/mangas.json";
    (0, fs_1.writeFileSync)(path2, data, "utf-8");
    return true;
}
exports.sauvegarder = sauvegarder;
function downloadImg(imgStr, name_manga) {
    return __awaiter(this, void 0, void 0, function () {
        var response, img;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(imgStr, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'image/png',
                        },
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.arrayBuffer().then(function (buffer) { return buffer; })];
                case 2:
                    img = _a.sent();
                    supabase_1.BDD.addImgToTest(name_manga + ".png", img);
                    return [2 /*return*/];
            }
        });
    });
}
exports.downloadImg = downloadImg;
// downloadImg()
