import instance from './index.js'

type ChartAPIResponse = {
	data: object
}

const loadChart = async (url: string, filter?: string): Promise<ChartAPIResponse> => {
	return await instance.get(`${url}?filter=${filter}`)
}

export { loadChart }
