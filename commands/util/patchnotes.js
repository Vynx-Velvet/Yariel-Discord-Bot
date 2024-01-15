// 'patchnotes.js'
import { SlashCommandBuilder } from "discord.js";
import { fetchPatches } from "../../cogs/fetchPatches.js";

export const data = new SlashCommandBuilder()
  .setName("patch")
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription("The game for which you want the current patch")
      .setRequired(true) // Set the option as required
      .setAutocomplete(true)
  )
  .setDescription("Returns the current patch notes of the given game.");

export async function execute(interaction) {
  await interaction.deferReply();
  const patch = await fetchPatches(interaction.options.getString("game"));
  await interaction.followUp({
    embeds: [patch],
  });
}
