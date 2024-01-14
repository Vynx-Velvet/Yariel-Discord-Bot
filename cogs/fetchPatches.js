// 'fetchPatches.js'
import axios from "axios";
import { createPatchEmbed } from "../util/embeds.js";

export async function scrapeWebpage(game) {
  try {

    if (game === "LeagueOfLegends" || game === "TFT") {

      var response = await axios.get(
        game === "LeagueOfLegends"
          ? "http://localhost:3000/game-version/LeagueOfLegends"
          : "http://localhost:3000/game-version/TFT"
      );

      var data = response.data;
      
    }

    if (game === "Valorant") {

      var response = await axios.get(
        "http://localhost:3000/game-version/Valorant"
      );

      var data = response.data;      

    }

    var patchEmbed = await createPatchEmbed(data);

    return patchEmbed;
  } catch (error) {
    console.error(error);
  }
}
