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
exports.AddManga = void 0;
var discord_js_1 = require("discord.js");
var supabase_1 = require("../supabase");
var cheerio = __importStar(require("cheerio"));
// import mangas from "../data/mangas.json";
var function_1 = require("../function");
exports.AddManga = {
    name: "addmanga",
    description: "Add a manga to the scrap bot",
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Name of the manga",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
        {
            name: "chapitre",
            description: "numero du dernier chapitre",
            type: discord_js_1.ApplicationCommandOptionType.Number,
            required: true,
            autocomplete: true
        },
        {
            name: "page",
            description: "le manga est t'il sur plusieurs pages ou non",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    run: function (client, interaction) { return __awaiter(void 0, void 0, void 0, function () {
        var nom;
        var _a;
        return __generator(this, function (_b) {
            nom = (_a = interaction.options.get("name")) === null || _a === void 0 ? void 0 : _a.value;
            nom = nom === null || nom === void 0 ? void 0 : nom.toString().toLowerCase().replaceAll(" ", "-");
            //console.log(mangas.find(manga => manga.name === nom));
            supabase_1.BDD.getManga(nom).then(function (manga) { return __awaiter(void 0, void 0, void 0, function () {
                var page, verif, text, $, image_1, synopsis;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(manga.length === 1)) return [3 /*break*/, 1];
                            supabase_1.BDD.getUser(interaction.user.id).then(function (user) {
                                if ((user === null || user === void 0 ? void 0 : user.length) === 1) {
                                    supabase_1.BDD.getLien(manga[0].id_manga).then(function (user) {
                                        if (user.find(function (id_user) { return id_user.id_user == interaction.user.id; }) !== undefined) {
                                            interaction.followUp({
                                                ephemeral: true,
                                                content: "tu est déjà dans la liste des personnes à prévenir"
                                            });
                                        }
                                        else {
                                            interaction.followUp({
                                                ephemeral: true,
                                                content: "Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"
                                            });
                                            supabase_1.BDD.addLien(manga[0].id_manga, interaction.user.id);
                                        }
                                    });
                                }
                                else {
                                    supabase_1.BDD.addUser(interaction.user.id, interaction.user.username, interaction.user.avatarURL()).then(function () {
                                        supabase_1.BDD.addLien(manga[0].id_manga, interaction.user.id).then(function () {
                                            interaction.followUp({
                                                ephemeral: true,
                                                content: "Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"
                                            });
                                        });
                                    });
                                }
                            });
                            return [3 /*break*/, 4];
                        case 1:
                            page = (_a = interaction.options.get("page")) === null || _a === void 0 ? void 0 : _a.value;
                            return [4 /*yield*/, fetch("https://fr-scan.com/manga/" + nom + "/", {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'text/html',
                                    },
                                })];
                        case 2:
                            verif = _c.sent();
                            return [4 /*yield*/, verif.text()];
                        case 3:
                            text = _c.sent();
                            $ = cheerio.load(text);
                            //console.log($(".summary_image img").attr("src"));
                            if ($(".summary_image img").attr("src") === undefined) {
                                interaction.followUp({
                                    ephemeral: true,
                                    content: "Manga non trouvable sur le site fr-scan.com"
                                });
                                return [2 /*return*/];
                            }
                            image_1 = $(".summary_image img").attr("src");
                            synopsis = $(".summary__content").text().trim();
                            // console.log(synopsis);
                            supabase_1.BDD.addManga(nom, (_b = interaction.options.get("chapitre")) === null || _b === void 0 ? void 0 : _b.value, (page === "oui" || page === "yes" || page === "o" || page === "y") ? true : false, image_1, synopsis).then(function () {
                                (0, function_1.downloadImg)(image_1, nom);
                                supabase_1.BDD.getManga(nom).then(function (manga) {
                                    supabase_1.BDD.getUser(interaction.user.id).then(function (user) {
                                        if ((user === null || user === void 0 ? void 0 : user.length) === 0) {
                                            var useravatar = interaction.user.avatarURL();
                                            supabase_1.BDD.addUser(interaction.user.id, interaction.user.username, useravatar).then(function () {
                                                interaction.followUp({
                                                    ephemeral: true,
                                                    content: "Manga ajouté avec succès"
                                                });
                                                return;
                                            });
                                        }
                                        supabase_1.BDD.addLien(manga[0].id_manga, interaction.user.id).then(function () {
                                            interaction.followUp({
                                                ephemeral: true,
                                                content: "Manga ajouté avec succès"
                                            });
                                        });
                                    });
                                });
                            });
                            _c.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); }
};
