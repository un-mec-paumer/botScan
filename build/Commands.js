"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
var AddManga_1 = require("./Command/AddManga");
var SupManga_1 = require("./Command/SupManga");
var ListeManga_1 = require("./Command/ListeManga");
var AddAlerte_1 = require("./Command/AddAlerte");
var SupAlerte_1 = require("./Command/SupAlerte");
exports.Commands = [
    AddManga_1.AddManga,
    SupManga_1.SupManga,
    ListeManga_1.ListeManga,
    AddAlerte_1.AddAlerte,
    SupAlerte_1.SupAlerte
];
