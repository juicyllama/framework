export class GoogleAnalyticsApp {
	public static mountRoutePrefix = '/app/google-analytics'

	public static createRoute(path: string) {
		return `/${GoogleAnalyticsApp.mountRoutePrefix}/${path}`.replace(/\/+/g, '/')
	}
}
