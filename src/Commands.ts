import { Command } from "./Command";
import { AddManga } from "./Command/AddManga";
import { SupManga } from "./Command/SupManga";
import { ListeManga } from "./Command/ListeManga";

export const Commands: Command[] = [
    AddManga,
    SupManga,
    ListeManga
];