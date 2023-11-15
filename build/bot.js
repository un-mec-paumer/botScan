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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var dotenv = __importStar(require("dotenv"));
var ready_1 = __importDefault(require("./listeners/ready"));
var interactionCreate_1 = __importDefault(require("./listeners/interactionCreate"));
var messageCreate_1 = __importDefault(require("./listeners/messageCreate"));
var function_1 = require("./function");
var express_1 = __importDefault(require("express"));
var supabase_1 = require("./supabase");
dotenv.config();
function ntm() {
    supabase_1.BDD.verifTokens();
}
console.log("Bot is starting...");
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.DirectMessageReactions
    ]
});
(0, ready_1.default)(client);
(0, interactionCreate_1.default)(client);
(0, messageCreate_1.default)(client);
// console.log(process.env.TOKEN);
client.login(process.env.TOKEN);
var interval = setInterval(function_1.finderAll, 1000 * 60 * 10, client);
var interval2 = setInterval(ntm, 1000);
// client.users.fetch("452370867758956554").then((user) => {
//     console.log(user.avatarURL())
// });
function handleConnectionValidation() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    // Attendez la réaction de l'utilisateur
                    client.on("messageReactionAdd", function (reaction, reactingUser) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (reaction.emoji.name === "👍") {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return [2 /*return*/];
                        });
                    }); });
                })];
        });
    });
}
function handleCreateUser() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    // Attendez la réaction de l'utilisateur
                    client.on("messageReactionAdd", function (reaction, reactingUser) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (reaction.emoji.name === "👍") {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return [2 /*return*/];
                        });
                    }); });
                })];
        });
    });
}
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express_1.default.urlencoded({ extended: true }));
app.listen(3000, function () {
    console.log("Server started!");
});
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.get("/mangas", function (req, res) {
    supabase_1.BDD.getMangas().then(function (data) {
        res.send(data);
    });
});
app.post("/mangaImg", function (req, res) {
    supabase_1.BDD.getImgFromTest(req.body.name).then(function (data) {
        res.send(data);
    });
});
app.post("/mangasByToken", function (req, res) {
    supabase_1.BDD.getMangasByToken(req.body.token).then(function (data) {
        if (data === undefined || data.length === 0) {
            res.send({ result: "notExist" });
            return;
        }
        var result = [];
        data.forEach(function (e) {
            result.push({
                id: e.id_manga,
                name: e.manga_name,
                chap: e.chapitre_manga,
                page: e.page,
                img: e.img,
                synopsis: e.synopsis
            });
        });
        res.send(result);
    });
});
app.post("/mangaByid", function (req, res) {
    supabase_1.BDD.getMangaById(parseInt(req.body.id)).then(function (data) {
        // console.log("coucou", req);
        res.send(data);
    });
});
app.post("/manga", function (req, res) {
    //console.log(req.body);
    supabase_1.BDD.getManga(req.body.name).then(function (data) {
        res.send(data);
    });
});
app.post("/addSub", function (req, res) {
    supabase_1.BDD.addAlerteByToken(req.body.id_manga, req.body.token).then(function (data) {
        res.send({ res: true });
    });
});
app.post("/deleteSub", function (req, res) {
    supabase_1.BDD.suppAlerteByToken(req.body.id_manga, req.body.token).then(function (data) {
        res.send({ res: true });
    });
});
app.post("/getSub", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supabase_1.BDD.getAlerteByToken(req.body.token, req.body.id_manga)];
            case 1:
                data = _a.sent();
                //console.log(data?.length === 0 ? false : true);
                res.send({ sub: (data === null || data === void 0 ? void 0 : data.length) === 0 ? false : true });
                return [2 /*return*/];
        }
    });
}); });
app.post("/connexion", function (req, res) {
    supabase_1.BDD.getUserByName(req.body.name).then(function (data) {
        //console.log(data);
        if ((data === null || data === void 0 ? void 0 : data.length) === 0) {
            res.send({ token: "not Exist" });
            return;
        }
        client.users.fetch(data[0].id_user).then(function (user) {
            //const connectionId = randomString();
            // Stockez cet identifiant de connexion en attente
            //pendingConnections.set(connectionId, user.id);
            user.send("bonjour quelqu'un veut se connecter sur le site ScanManager et nous voudrions savoir si c'est bien vous (pour accepter la connexion :👍 sinon 👎)").then(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Vous n'avez pas besoin de gérer la réaction ici, car vous pouvez le faire dans le gestionnaire de réaction
                    handleConnectionValidation().then(function (value) {
                        if (value) {
                            supabase_1.BDD.addToken(user.id).then(function (data) {
                                res.send({ token: data });
                            });
                        }
                        else {
                            res.send({ token: "not Accept" });
                        }
                    });
                    return [2 /*return*/];
                });
            }); });
        });
    });
});
app.post("/getUser", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supabase_1.BDD.getUserInfo(req.body.token)
                // console.log(data);
            ];
            case 1:
                data = _a.sent();
                // console.log(data);
                if (data === undefined || data.length === 0) {
                    res.send({ result: "notExist" });
                    return [2 /*return*/];
                }
                //.catch((err) => {return err});
                //console.log(data);
                res.send(data[0]);
                return [2 /*return*/];
        }
    });
}); });
app.post("/newUser", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idDiscord;
    return __generator(this, function (_a) {
        idDiscord = req.body.id;
        //const name = req.body.name;
        client.users.fetch(idDiscord).then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
            var avatarURL, name;
            return __generator(this, function (_a) {
                avatarURL = user.avatarURL();
                name = user.username;
                user.send("bonjour quelqu'un veut crée ajouté votre compte sur se bot si il s'agit de vous reagisser avec 👍 pour accespter sinon 👎").then(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        handleCreateUser().then(function (value) {
                            if (!value) {
                                res.send({ result: "not Accept" });
                                return;
                            }
                            supabase_1.BDD.addUser(idDiscord, name, avatarURL).then(function (data) {
                                //res.send({res:true});
                                supabase_1.BDD.addToken(idDiscord).then(function (data) {
                                    res.send({ result: data });
                                });
                            });
                            // if(user.globalName === "totodu91") {
                            //     BDD.addToken(idDiscord).then((data) => {
                            //         res.send({result:data});
                            //     });
                            // }
                        });
                        return [2 /*return*/];
                    });
                }); })
                    .catch(function () {
                    res.send({ result: "not Access to DM" });
                });
                return [2 /*return*/];
            });
        }); }).catch(function () {
            res.send({ result: "ID not exist in discord" });
        });
        return [2 /*return*/];
    });
}); });
app.post("/sendMessage", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var User;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supabase_1.BDD.getUserByToken(req.body.token).then(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                    var res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client.users.fetch(data[0].user_id).then(function (user) {
                                    //console.log("user in: ",user);
                                    return user;
                                })];
                            case 1:
                                res = _a.sent();
                                return [2 /*return*/, res];
                        }
                    });
                }); })];
            case 1:
                User = _a.sent();
                //console.log("user out: ",User);
                client.users.fetch(process.env.DEV).then(function (user) {
                    user.send("message de " + User.username + " : " + req.body.text);
                }).then(function () {
                    res.send({ res: true });
                }); // }).catch((err) => {res.send({res:false})});
                return [2 /*return*/];
        }
    });
}); });
