import { Command } from "./Command";
import { AddManga } from "./Command/AddManga";
import { SupManga } from "./Command/SupManga";

export const Commands: Command[] = [
    AddManga,
    SupManga
];