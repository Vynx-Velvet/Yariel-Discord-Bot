// 'patchnotes.js'
import { SlashCommandBuilder } from "discord.js";
import { env } from "node:process";
export const data = new SlashCommandBuilder()
  .setName("txt2img")
  .addStringOption((option) =>
    option
      .setName("prompt")
      .setDescription("The things you want to see in your image.")
      .setRequired(true) // Set the option as required
      .setMaxLength(256)

  )
  .addIntegerOption((option) =>
    option
    .setName("amount")
    .setDescription("Select the amount of images to generate with this request.")
    .addChoices({
      name: "Single",
      label: "Single",
      value: 1,
    },{
      name: "Double",
      label: "Double",
      value: 2,
    },{
      name: "Grid (4 Images, 2x2)",
      label: "Grid (4 Images, 2x2)",
      value: 4,
    })
    )
  .addStringOption((option) =>
    option
      .setName("negative-prompt")
      .setDescription("The things you don't want to see in your image.")
      .setMaxLength(512)
  )
  .addStringOption((option) =>
    option
      .setName("aspect-ratio")
      .setDescription("The aspect ratio desired for your image.")
      .addChoices({
        name: "Square",
        label: "Square",
        value: "square",
      },{
        name: "Portrait",
        label: "Portrait",
        value: "portrait",
      },{
        name: "Landscape",
        label: "Landscape",
        value: "landscape",
      })
  )
  .addStringOption((option) =>
    option
      .setName("steps")
      .setDescription("The number of sampling steps desired for your image.")
      .addChoices({
        name: "50 Steps (Fastest Generation, Lowest Quality)",
        label: "50 Steps (Fastest Generation, Lowest Quality)",
        value: "50",
      },{
        name: "100 Steps (Balanced Speed and Quality)",
        label: "100 Steps (Balanced Speed and Quality)",
        value: "100",
      },{
        name: "250 Steps (Slowest Generation, Highest Quality)",
        label: "250 Steps (Slowest Generation, Highest Quality)",
        value: "250",
      },{
        name: "400 Steps (Insane Mode)",
        label: "400 Steps",
        value: "400",
      })
  )
  .addStringOption((option) =>
    option
      .setName("style")
      .setDescription("The style for your image.") // Set the option as required
      .addChoices(
        {
          name: "Enhancer",
          label: "Enhancer",
          value: "enhance",
        },
        {
          name: "Anime",
          label: "Anime",
          value: "anime",
        },
        {
          name: "Photographic",
          label: "Photographic",
          value: "photographic",
        },
        {
          name: "Digital Art",
          label: "Digital Art",
          value: "digital-art",
        },
        {
          name: "Comic Book",
          label: "Comic Book",
          value: "comic-book",
        },
        {
          name: "Fantasy Art",
          label: "Fantasy Art",
          value: "fantasy-art",
        },
        {
          name: "Analog Film",
          label: "Analog Film",
          value: "analog-film",
        },
        {
          name: "Neon Punk",
          label: "Neon Punk",
          value: "neonpunk",
        },
        {
          name: "Isometric",
          label: "Isometric",
          value: "isometric",
        },
        {
          name: "Low Poly",
          label: "Low Poly",
          value: "lowpoly",
        },
        {
          name: "Origami",
          label: "Origami",
          value: "origami",
        },
        {
          name: "Line Art",
          label: "Line Art",
          value: "line-art",
        },
        {
          name: "Craft Clay",
          label: "Craft Clay",
          value: "craft-clay",
        },
        {
          name: "Cinematic",
          label: "Cinematic",
          value: "cinematic",
        },
        {
          name: "3D Model",
          label: "3D Model",
          value: "3d-model",
        },
        {
          name: "Pixel Art",
          label: "Pixel Art",
          value: "pixel-art",
        },
        {
          name: "Texture",
          label: "Texture",
          value: "texture",
        },
        {
          name: "Futuristic",
          label: "Futuristic",
          value: "futuristic",
        },
        {
          name: "Realism",
          label: "Realism",
          value: "realism",
        },
        {
          name: "Watercolor",
          label: "Watercolor",
          value: "watercolor",
        },
        {
          name: "Industrial",
          label: "Industrial",
          value: "industrial",
        },
        {
          name: "Photorealistic",
          label: "Photorealistic",
          value: "photorealistic",
        }
      )
  )
  .setDescription("Use Y-Tokens to create images!");

export async function execute(interaction) {
  await interaction.deferReply()
  await genImage(interaction)
}

//Send a Post Request to the API with the proper payload


const bunStatusHead = {
  method: "GET",
  headers: {
    secret: env.INTERNAL_TOKEN,
    "content-type": "application/json"
  }
};

async function genImage(interaction) {
  const payload = {
    aspect_ratio: interaction.options.getString("aspect-ratio") || "square",
    guidance_scale: 25,
    negprompt: interaction.options.getString("negative-prompt") || null,
    prompt: interaction.options.getString("prompt") || null,
    safe_filter: false,
    samples: interaction.options.get("amount") || 1,
    steps: (Number(interaction.options.getString("steps")) || 150),
    style: interaction.options.getString("style") || null,
  };

  const bunGenHead = {
    method: "POST",
    headers: {
      secret: env.INTERNAL_TOKEN,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      interaction: {
        user: interaction.user.id,
        token: interaction.token,
        interaction_id: interaction.id
      },
      generation_request: payload
    })
  };
  
  const jobId = await fetch(
    "http://localhost:3000/api/v1/ai/generate",
    bunGenHead
  );
  const id = await jobId.text()
  await interaction.followUp({content: `***${interaction.options.getString("prompt")}***\nJob Id: ${id}`})

  setTimeout(async () => {
    await fetchResults(id, interaction)
  }, 3000)
  
  return
}

async function fetchResults(processId, interaction) {
  const status = await fetch(
    `http://localhost:3000/api/v1/ai/status?jobId=${processId}`,
    bunStatusHead
  );
  const response = JSON.parse(await status.text())
  switch (response.jobget[0].status) {
    case "FAILED":
      await interaction.editReply(
        {content: `response status = ${response.jobget[0].status}`}
      )
      break;
    case "IN_QUEUE":
      setTimeout(async () => {
        await fetchResults(processId, interaction)
      }, 3000)
      break;
    case "IN_PROGRESS":
      setTimeout(async () => {
        await fetchResults(processId, interaction)
      }, 3000)
      break;
    case "COMPLETED":
      const images = response.jobget[0].results.split(",")
      switch (images.length) {
        case 1:
          var resultEmbeds = [{
            url: "https://example.org/",
            image: {
              url: images[0],
            },
          }]
          break;
        case 2:
          var resultEmbeds = [{
            url: "https://example.org/",
            image: {
              url: images[0],
            },
            },
           {
            url: "https://example.org/",
            image: {
              url: images[1],
            },
          }]
          break;
        case 4:
          var resultEmbeds = [{
            url: "https://example.org/",
            image: {
              url: images[0],
            },
            },
           {
            url: "https://example.org/",
            image: {
              url: images[1],
            },
            },
           {
            url: "https://example.org/",
            image: {
              url: images[2],
            },
            },
           {
            url: "https://example.org/",
            image: {
              url: images[3],
            },  
          }]
      }
      await interaction.editReply({
        content: `***${interaction.options.getString("prompt")}*** -${interaction.user}`,
        embeds: resultEmbeds
      })
      return

  }
}