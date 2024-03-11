export class GoogleAnalyticsApp {
	public static readonly apiTag = 'Google Analytics 4'

	public static mountRoutePrefix = '/app/google-analytics'

	public static createRoute(path: string) {
		return `/${GoogleAnalyticsApp.mountRoutePrefix}/${path}`.replace(/\/+/g, '/')
	}

	public static createApiSubTag(name: string) {
		return `${GoogleAnalyticsApp.apiTag}: ${name}`
	}
}
