import { serverQueryContent } from '#content/server'

export default eventHandler(async (event) => {
  const listFullArticles = await serverQueryContent(event).where({ _type: 'markdown', navigation: { $ne: false } }).find()
  return listFullArticles.map((doc) => ({
	title: doc.title,
	_path: doc._path,
	description: doc.description,
  }))
})
