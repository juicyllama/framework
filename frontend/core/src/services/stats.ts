import instance from './index.js'

type StatsAPIResponse = {
	data: object
}

const loadStats = async (url: string, filter?: string): Promise<StatsAPIResponse> => {
	return await instance.get(`${url}?filter=${filter}`)
}

export { loadStats }
