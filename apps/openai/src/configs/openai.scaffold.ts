import { Configuration, OpenAIApi } from 'openai'

export function OpenaiScaffold(OPENAI_API_KEY: string) {
	const configuration = new Configuration({
		apiKey: OPENAI_API_KEY,
	})

	return new OpenAIApi(configuration)
}
