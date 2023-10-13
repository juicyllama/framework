import instance from './index'

type ChartAPIResponse = {
	data: object
}

const loadChart = async (url: string): Promise<ChartAPIResponse> => {
	return await instance.get(url)
}

export { loadChart }
