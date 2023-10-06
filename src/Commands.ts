import { Command } from "./Command";
import { AddManga } from "./Command/AddManga";
import { SupManga } from "./Command/SupManga";
import { ListeManga } from "./Command/ListeManga";
import { AddAlerte } from "./Command/AddAlerte";
import { SupAlerte } from "./Command/SupAlerte";

export const Commands: Command[] = [
    AddManga,
    SupManga,
    ListeManga,
    AddAlerte,
    SupAlerte
];