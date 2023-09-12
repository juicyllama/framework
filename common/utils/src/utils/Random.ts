import FACTS from '../assets/llama.facts.json'

export class Random {
	static LlamaFact(): string {
		return FACTS[Math.floor(Math.random() * FACTS.length)]
	}
}
