import axios from 'axios'

export class Images {
	/**
	 * Download an image from a URL and return it
	 * @param url
	 */

	static async downloadImage(url): Promise<Buffer> {
		const image = await axios.get(url, { responseType: 'arraybuffer' })
		return Buffer.from(image.data)
	}
}
