// 'index.js'
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

// Create a new collection for commands
client.commands = new Collection();

// Load the commands from the commands directory
const foldersPath = join("commands");
const commandFolders = readdirSync(foldersPath);

// Function to import all commands from the commands directory
const importCommands = async () => {
  for (const folder of commandFolders) {
    // Get the path to the commands folder and it's associated files
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      file.endsWith(".js")
    );
    // Loop through all command files
    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      try {
        // Import the command file
        const command = await import(`./${filePath.replace(/\\/g, "/")}`);
        // Check if the command has the required properties
        if ("data" in command && "execute" in command) {
          // Add the command to the collection
          client.commands.set(command.data.name, command);
        } else {
          // If the command is missing a required property, log a warning
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      } catch (error) {
        // If there is an error, log it
        console.error(`Error importing ${filePath}:`, error);
      }
    }
  }
};

// Import all commands and then start the bot
importCommands().then(() => {
  // When the client is ready, run this code (only triggers once).
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  // Listen for interactions and execute the corresponding command
  client.on(Events.InteractionCreate, async (interaction) => {
    // Check if the interaction is an autocomplete request
    if (interaction.isAutocomplete()) {
      if (interaction.commandName === "patch") {
        const input = interaction.options.getFocused(true);
        // The list of allowed games
        const games = ["LeagueOfLegends", "TFT", "Valorant"];
        if (!input.value == "") {
          // Filter the games that match the input
          const filtered = games.filter((game) =>
            game.toLowerCase().startsWith(input.value.toLowerCase())
          );
          // Respond with the filtered games as choices
          await interaction.respond(
            filtered.map((game) => ({ name: game, value: game }))
          );
        } else {
          // If matching games are empty, respond with all games
          await interaction.respond(
            games.map((game) => ({ name: game, value: game }))
          );
        }
      }
    }

    if (!interaction.isChatInputCommand()) return;

    // Get the command from the collection
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    // Execute the command
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  });

  // Start Client
  client.login(process.env.DISCORD_TOKEN);
});
