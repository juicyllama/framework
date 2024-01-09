import OpenAi from 'openai'

export function OpenaiScaffold(OPENAI_API_KEY: string) {
	const openai = new OpenAi({
		apiKey: OPENAI_API_KEY,
	})

	return openai
}
