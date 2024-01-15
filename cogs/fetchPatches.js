// 'fetchPatches.js'
import { createPatchEmbed } from "../util/embeds.js";

export async function fetchPatches(game) {
  try {
    var url = `http://localhost:3000/game-version/${game}`;
    var response = await (await fetch(url, { method: "GET" })).json();
    var patchEmbed = await createPatchEmbed(response.data);
    return patchEmbed;
  } catch (error) {
    console.error(error);
  }
}
