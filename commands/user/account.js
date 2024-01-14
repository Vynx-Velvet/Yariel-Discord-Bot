import { SlashCommandBuilder } from "discord.js";
import { env } from "node:process";

export const data = new SlashCommandBuilder()
  .setName("account")
  .setDescription("Check your Yariel account details.");

const options = {
  method: "GET",
  headers: {
    secret: env.INTERNAL_TOKEN,
  },
};

export async function execute(interaction) {
  fetch(`http://localhost:3000/api/v1/ai/account?userId=${interaction.user.id}&interactionId=${interaction.id}&interactionToken=${interaction.token}`, options);
}
