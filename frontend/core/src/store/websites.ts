import { defineStore } from 'pinia'
import { QVueGlobals } from 'quasar'
import { websiteService, WEBSITE_ENDPOINT } from '../services/websites/website'
import { Website } from '../types'

export const WebsitesStore = defineStore('websites', {
	state: () => {
		return <Website[]>JSON.parse(window.localStorage.getItem('websites') ?? '[]')
	},
	actions: {
		async loadWebsites(): Promise<Website[]> {
			const result = await websiteService.findAll({})
			if (result) {
				this.setWebsites(result)
			}
			return result
		},
		setWebsites(data: Website[]) {
			window.localStorage.setItem('websites', JSON.stringify(data))
			this.$state = data
		},
		async updateWebsite(website_id: number, data: Partial<Website>, $q?: QVueGlobals): Promise<Website> {
			const result = await websiteService.update({
				url: WEBSITE_ENDPOINT + '/' + website_id,
				data: data,
				q: $q,
			})

			if (result) {
				for (let i = 0; i < this.$state.length; i++) {
					if (this.$state[i].website_id === result.website_id) {
						this.$state[i] = result
					}
				}
			}

			return result
		},

		async deleteWebsite(website_id: number, $q?: QVueGlobals): Promise<Website> {
			const result = await websiteService.delete({
				url: WEBSITE_ENDPOINT + '/' + website_id,
				q: $q,
                record_id: website_id,
			})

			if (result) {
				this.$state = this.$state.filter((website) => website.website_id !== website_id)
			}

			return result
		},

		getWebsiteById(website_id: number): Website | undefined {
			return this.$state.find((website) => website.website_id === website_id)
		}

	},
	getters: {}
})