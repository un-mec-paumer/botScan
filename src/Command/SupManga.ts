import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import mangas from "../data/mangas.json";
import { writeFile } from "fs";

export const SupManga: Command = {
    name: "supmanga",
    description: "Supprime un manga de la liste",
    // type: "CHAT_INPUT",
    run: async (client: Client, interaction: CommandInteraction) => {
        
    }
};