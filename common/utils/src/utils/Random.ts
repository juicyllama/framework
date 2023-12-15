import FACTS from '../assets/llama.facts.json'
import { faker } from '@faker-js/faker'
import { Strings } from './Strings'

export class Random {
	static LlamaFact(): string {
		return FACTS[Math.floor(Math.random() * FACTS.length)]
	}

	static Number(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min) + min)
	}

	static String(length?: number): string {

		if(!length) Math.floor(Math.random() * 8) + 5

		let result = ''
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		const charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	static Password(length?: number): string {

		if(!length) length = 16

		let result = ''
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@£$%^&*()_+=-{}[]<>?:;~'
		const charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	static Words(seperator?: string, length?: number, type?: 'noun' | 'adjective' | 'adverb', transform?: 'capitalize'): string {
		if(!seperator) seperator = ' '
		if(!length) length = Math.floor(Math.random() * 5) + 1
		
		let result = ''

		for(let i = 0; i < length; i++) {

			let word = ''
			
			if(!type){

				word = faker.word.sample()
			
			
			}else {
				switch(type) {
					case 'noun':
						word = faker.word.noun()
						break
					case 'adjective':
						word = faker.word.adjective()
						break
					case 'adverb':
						word = faker.word.adverb()
						break
				}
			}

			if(transform && transform === 'capitalize') {
				result += Strings.capitalize(word)
			}else{
				result += word
			}

			result += seperator
		}

		var pos = result.lastIndexOf(seperator);
		return result.substring(0,pos)
	}
}
