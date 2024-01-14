import { EmbedBuilder, Colors } from "discord.js";

export async function createPatchEmbed(patchData) {
	const embed = new EmbedBuilder()
		.setTitle(patchData.title)
		.setDescription(patchData.patchBlurb || null)
		.setThumbnail(patchData.patchIcon || null)
		.setImage(patchData.patchHighlights)
		.setColor(Colors.Blue)
		.setURL(patchData.patchURL)
	return embed;
}

export async function createSDEmbed(results) {
	const embed = new EmbedBuilder()
		.setTitle(results.status || results)
		.setImage(results.result.output[0] || null)
		.setColor(Colors.Blue)
	return embed;
}