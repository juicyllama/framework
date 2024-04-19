import { defineStore } from 'pinia'
import { QVueGlobals } from 'quasar'
import { websiteService as service, WEBSITE_ENDPOINT } from '../services/websites/website'
import { Website } from '../types'

type T = Website
const localStore = 'websites'

export const WebsitesStore = defineStore(localStore, {
	state: () => {
		return <T[]>JSON.parse(window.localStorage.getItem(localStore) ?? '[]')
	},
	actions: {
		async findAll(): Promise<T[]> {
			const result = await service.findAll({})
			window.sessionStorage.setItem(localStore, JSON.stringify(result))
			this.$state[localStore] = result
			return result
		},
		/** depreciate for consistancy of function names (replaced by findAll) */
		async loadWebsites(): Promise<Website[]> {
			const result = await service.findAll({})
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
			const result = await service.update({
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
				window.localStorage.setItem('websites', JSON.stringify(this.$state))
			}

			return result
		},

		async deleteWebsite(website_id: number, $q?: QVueGlobals): Promise<Website> {
			const result = await service.delete({
				url: WEBSITE_ENDPOINT + '/' + website_id,
				q: $q,
				record_id: website_id,
			})

			if (result) {
				this.$state = this.$state.filter(website => website.website_id !== website_id)
				window.localStorage.setItem('websites', JSON.stringify(this.$state))
			}

			return result
		},

		getWebsiteById(website_id: number): Website | undefined {
			return this.$state.find(website => website.website_id === website_id)
		},
	},
	getters: {
		get(state): T[] | null {
			return state[localStore]
		},
	},
})
