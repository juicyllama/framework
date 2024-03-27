import { Api, apiRequest } from '../../helpers'
import { InstalledApp, preInstallCheckResponse } from '../../types'

type T = InstalledApp
export const INSTALLED_APPS_ENDPOINT = '/apps/installed'
export const INSTALLED_APPS_WEBSOCKET_EVENT = 'account_${account_id}_apps_installed'
export class InstalledAppsService extends Api<T> {
	constructor() {
		super(INSTALLED_APPS_ENDPOINT)
	}

	async precheck(app_id: number, settings: any): Promise<preInstallCheckResponse> {
		return await apiRequest<preInstallCheckResponse>({
			url: `${INSTALLED_APPS_ENDPOINT}/precheck`,
			data: {
				app_id: app_id,
				settings: settings,
			},
			method: 'POST',
		})
	}
}
