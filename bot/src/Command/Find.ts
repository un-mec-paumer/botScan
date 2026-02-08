import { Command } from "../Command";
import { finderAll } from "../function";

export const Find: Command = {
    name: "find",
    description: "start a scan for search new chapter",
    descriptionLocalizations: {
        fr: "lance un scan pour chercher de nouveaux chapitres"
    },

    async run(client, interaction) {
        interaction.followUp({
            ephemeral: true,
            content: "Scan en cours..."
        });
        const res = await finderAll(client);      
        if (res) {
            interaction.followUp({
                ephemeral: true,
                content: "Scan terminé on a trouvé des nouveaux chapitres !"
            });
        } else {
            interaction.followUp({
                ephemeral: true,
                content: "rien de plus pour le moment"
            });
        }
    }
};