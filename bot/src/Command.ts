import { ChatInputApplicationCommandData, Client, ChatInputCommandInteraction } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: ChatInputCommandInteraction) => void;
}
