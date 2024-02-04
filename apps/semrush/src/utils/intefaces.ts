export interface DomainVsDomainParams {
	domains: string
	database: string
	display_limit: number
	display_date: string
	export_columns: string
	export_decode: 1 | 0
	export_escape: 1
	display_sort: string
	display_filter: string
}


export interface AuthorityScoreParams{
    target: string
    target_type: string
}

export interface DomainOrganicSearchKeywordsParams {
	domain: string
	database: string
	display_limit: number
    display_offset: number
	display_date: string
    display_daily: 1
    display_positions: string
    display_positions_type: string
	export_columns: string
	export_escape: 1
	display_sort: string
	display_filter: string
}


export interface CompetitorsInOrganicSearchParams {
	domain: string
	database: string
	display_limit: number
    display_offset: number
	display_date: string
	export_columns: string
	export_escape: 1
    export_decode: 1 | 0
	display_sort: string
}
