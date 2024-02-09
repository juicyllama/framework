export class Json {
	static getLocalStorageObject<T>(store_key: string): T | null {
		try{
			if(!window.localStorage) return null
			if(!window.localStorage.getItem(store_key)) return null
			const string = window.localStorage.getItem(store_key)
			if(!string) return null	
			return <T>JSON.parse(string)
		}catch(e){
			return null
		}
	}
}
