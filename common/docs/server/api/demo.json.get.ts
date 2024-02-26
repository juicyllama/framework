import data from '../sample-response/index'

export default eventHandler(async (event) => {
	return data.stats
})
