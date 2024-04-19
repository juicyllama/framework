import { defineStore } from 'pinia'
import { QVueGlobals } from 'quasar'
import { websiteService as service, WEBSITE_ENDPOINT } from '../services/websites/website'
import { Website } from '../types'

type T = Website
const localStore = 'websites'
const primayKey = 'website_id'

export const WebsitesStore = defineStore(localStore, {
	state: () => ({
		[localStore]: window.localStorage.getItem(localStore)
			? <T[]>JSON.parse(window.localStorage.getItem(localStore) ?? '[]')
			: [],
	}),
	actions: {
		async create(data: Partial<T>): Promise<T> {
			const result = await service.create({
				data
			})
			const results = <T[]>this.$state[localStore] ?? []
			results.push(result)

			this.$state[localStore] = results
			window.localStorage.setItem(localStore, JSON.stringify(results))
			return result
		},
		async findOne(record_id: number): Promise<T | undefined> {
			const result = await service.findOne({record_id})
			if(!result) return undefined
			const results = <T[]>this.$state[localStore]
			const index = results.findIndex((r) => r[primayKey] === result[primayKey])
			results[index] = result
			this.$state[localStore] = results
			window.localStorage.setItem(localStore, JSON.stringify(results))
			return result
		},
		async findAll(): Promise<T[]> {
			const result = await service.findAll({})
			window.sessionStorage.setItem(localStore, JSON.stringify(result))
			this.$state[localStore] = result
			return result
		},
		async update(data: Partial<T>): Promise<T> {
			const result = await service.update({
				data
			})
			const results = <T[]>this.$state[localStore]
			const index = results.findIndex((r) => r[primayKey] === result[primayKey])
			results[index] = result
			this.$state[localStore] = results
			window.localStorage.setItem(localStore, JSON.stringify(results))
			return result
		},
		async delete(record_id: number): Promise<T> {
			const result = await service.delete({
				record_id
			})
			const results = <T[]>this.$state[localStore]
			const index = results.findIndex((r) => r[primayKey] === result[primayKey])
			results.splice(index, 1)
			this.$state[localStore] = results
			window.localStorage.setItem(localStore, JSON.stringify(results))
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
		/** depreciate */
		setWebsites(data: Website[]) {
			window.localStorage.setItem('websites', JSON.stringify(data))
			this.$state = data
		},
		/** depreciate */
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
		/** depreciate */
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
		/** depreciate */
		getWebsiteById(website_id: number): Website | undefined {
			return this.$state.find(website => website.website_id === website_id)
		},
	},
	getters: {
		get(state): T[] {
			return state[localStore]
		},
	},
})
