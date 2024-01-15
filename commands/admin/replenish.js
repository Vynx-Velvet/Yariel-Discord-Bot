// 'replenish.js'
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("replenish")
  .addIntegerOption(
    (option) =>
      option
        .setName("amount")
        .setDescription("The amount of Y-Tokens to add to the user's account.")
        .setRequired(true)
  )
  .addMentionableOption(
    (option) =>
      option
        .setName("user")
        .setDescription("The user to replenish Y-Tokens for.")
        .setRequired(true)
  )
  .setDescription("Replenish a user's Y-Tokens.");

export async function execute(interaction) {
  const amount = interaction.options.getInteger("amount");
  const user = interaction.options.getMentionable("user");

  const options = {
    method: "POST",
    headers: {
      secret: process.env.INTERNAL_TOKEN,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      interaction: {
        user: interaction.user,
        guild: interaction.guild,
      },
      replenish_request: {
        amount: amount,
        user: user,
      },
    }),
  };
  
  const response = await fetch(
    "http://localhost:3000/api/v1/ai/grantToken",
    options
  );
  const data = await response.json();

  switch (data.result) {
    case "ok":
      await interaction.reply({
        content: `Successfully gave ${user} <:_:${process.env.Y_TOKEN_ID}>${amount}.\nNew Balance: <:_:${process.env.Y_TOKEN_ID}>${data.message}`,
      });
      break;
    case "error":
      await interaction.reply({
        content: `Error: ${data.message}`,
      });
      break;
  }
}
