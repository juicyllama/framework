import { APP_T } from './apps.constants'
import { AppCategory, AppInputType, AppIntegrationType, AppStoreIntegrationName } from './apps.enums'

export function appWordpressMock(): Partial<APP_T> {
	return {
		name: 'WordPress',
		url: 'https://wordpress.org',
		integration_type: AppIntegrationType.CREDENTIALS,
		integration_name: AppStoreIntegrationName.wordpress,
		category: AppCategory.cms,
		settings: [
			{
				key: 'WORDPRESS_URL',
				name: 'WordPress Website URL',
				input: {
					type: AppInputType.text,
					required: true,
				},
				description: 'Your WordPress URL, including http(s):// but without a trailing slash.',
			},
			{
				key: 'WORDPRESS_USERNAME',
				name: 'WordPress Username',
				input: {
					type: AppInputType.text,
					required: true,
				},
				description:
					'Your WordPress username which can be found in the users section of your WordPress admin area.',
			},
			{
				key: 'WORDPRESS_APPLICATION_PASSWORD',
				name: 'WordPress Application Password',
				input: {
					type: AppInputType.text,
					required: true,
				},
				private: true,
				description:
					'This is a specific application password (not your normal login password) which can be created on the user management page in the WordPress admin.',
			},
		],
	}
}
