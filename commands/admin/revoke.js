// 'replenish.js'
import { SlashCommandBuilder } from "discord.js";
import { env } from "node:process";

export const data = new SlashCommandBuilder()
  .setName("revoke")
  .addIntegerOption(
    (option) =>
      option
        .setName("amount")
        .setDescription("The amount of Y-Tokens to revoke from the user's account.")
        .setRequired(true) // Set the option as required
  )
  .addMentionableOption(
    (option) =>
      option
        .setName("user")
        .setDescription("The user to revoke Y-Tokens from.")
        .setRequired(true) // Set the option as required
  )
  .setDescription("Revoke a user's Y-Tokens.");

export async function execute(interaction) {
  const amount = interaction.options.getInteger("amount");
  const user = interaction.options.getMentionable("user");

  const options = {
    method: "POST",
    headers: {
      secret: env.INTERNAL_TOKEN,
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
    "http://localhost:3000/api/v1/ai/revokeToken",
    options
  );
  const data = await response.json();

  switch (data.result) {
    case "ok":
      await interaction.reply({
        content: `Successfully revoked <:_:${process.env.Y_TOKEN_ID}>${amount} from  ${user}.\nNew Balance: <:_:${process.env.Y_TOKEN_ID}>${data.message}`,
      });
	  break;
	case "error":
	  await interaction.reply({
		content: `Error: ${data.message}`
	  })
	  break;
  }
}
