import { App } from '../apps.entity'
import { INSTALLED_APP_T } from './installed.constants'

export function installedAppWordpressMock(app: App): Partial<INSTALLED_APP_T> {
	return {
		app_id: app.app_id,
		name: 'Our Wordpress App',
		settings: {
			WORDPRESS_URL: 'https://example.com',
			WORDPRESS_USERNAME: 'example',
			WORDPRESS_APPLICATION_PASSWORD: 'some strange key from wp',
		},
	}
}
