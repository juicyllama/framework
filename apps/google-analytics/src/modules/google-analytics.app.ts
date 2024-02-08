export class GoogleAnalyticsApp {
	public static readonly routePrefix = '/app/google-analytics'

	public static createRoute(path: string) {
		return `${GoogleAnalyticsApp.routePrefix}/${path}`.replace(/\/+/g, '/')
	}
}
