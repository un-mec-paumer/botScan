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
exports.AddAlerte = void 0;
var discord_js_1 = require("discord.js");
var supabase_1 = require("../supabase");
exports.AddAlerte = {
    name: "addalerte",
    description: "Add an alerte when a new chapter is out for a manga",
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Name of the manga",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
    ],
    run: function (client, interaction) { return __awaiter(void 0, void 0, void 0, function () {
        var name;
        var _a;
        return __generator(this, function (_b) {
            name = (_a = interaction.options.get("name")) === null || _a === void 0 ? void 0 : _a.value;
            name = name === null || name === void 0 ? void 0 : name.toString().toLowerCase().replaceAll(" ", "-");
            supabase_1.BDD.getManga(name).then(function (manga) {
                // console.log(manga);
                if (manga.length == 0) {
                    interaction.followUp({
                        ephemeral: true,
                        content: "Manga non trouvé"
                    });
                    return;
                }
                supabase_1.BDD.getUser(interaction.user.id).then(function (user) {
                    if ((user === null || user === void 0 ? void 0 : user.length) === 0) {
                        var useravatar = interaction.user.avatarURL();
                        supabase_1.BDD.addUser(interaction.user.id, interaction.user.username, useravatar).then(function () {
                            supabase_1.BDD.addLien(manga[0].id_manga, interaction.user.id).then(function () {
                                interaction.followUp({
                                    ephemeral: true,
                                    content: "vous avez été ajouté à la liste des personnes à prévenir de " + manga[0].name_manga.replaceAll("-", " ")
                                });
                            });
                        });
                        return;
                    }
                });
                supabase_1.BDD.getLien(manga[0].id_manga).then(function (user) {
                    // console.log(user, interaction.user.id);
                    if (user.find(function (id_user) { return id_user.id_user == interaction.user.id; }) !== undefined) {
                        interaction.followUp({
                            ephemeral: true,
                            content: "tu est déjà dans la liste des personnes à prévenir"
                        });
                    }
                    else {
                        supabase_1.BDD.addLien(manga[0].id_manga, interaction.user.id).then(function () {
                            interaction.followUp({
                                ephemeral: true,
                                content: "vous avez été ajouté à la liste des personnes à prévenir de " + manga[0].name_manga.replaceAll("-", " ")
                            });
                        });
                    }
                });
            });
            return [2 /*return*/];
        });
    }); }
};
