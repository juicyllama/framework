import FACTS from '../assets/llama.facts.json'

export class Random {
	static LlamaFact(): string {
		return FACTS[Math.floor(Math.random() * FACTS.length)]
	}

	static Number(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min) + min)
	}

	static String(length: number): string {
		let result = ''
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		const charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}
}
