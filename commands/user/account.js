// 'account.js'
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("account")
  .setDescription("Check your Yariel account details.");


//TODO: Convert to a POST, doesn't make much sense being a GET
const options = {
  method: "GET",
  headers: {
    secret: process.env.INTERNAL_TOKEN,
  },
};

//Ephemeral message containing account info is sent from API, not Yariel
export async function execute(interaction) {
  fetch(`http://localhost:3000/api/v1/ai/account?userId=${interaction.user.id}&interactionId=${interaction.id}&interactionToken=${interaction.token}`, options);
}
