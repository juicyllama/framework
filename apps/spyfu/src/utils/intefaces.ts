export interface OrganicKombatKeywordParams {
	includeDomainsCsv: string
	excludeDomainsCsv: string
	isIntersection: boolean
	sortBy: string
	sortOrder: string
	startingRow: number
	pageSize: number
	countryCode: string
	adultFilter: boolean
}

export interface LatestDomainStatsParams {
	domain: string
	countryCode: string
}

export interface DomainCompetitorParams {
	domain: string
	countryCode: string
	pageSize: number
	startingRow: number
}

export interface KeywordsResearchParams {
	keyword: string
	countryCode: string
}

interface BaseResponse {
	resultCount: number
}

export interface IDomainStats {
	searchMonth: number
	searchYear: number
	averageOrganicRank: number
	monthlyPaidClicks: number
	averageAdRank: number
	totalOrganicResults: number
	monthlyBudget: number
	monthlyOrganicValue: number
	totalAdsPurchased: number
	monthlyOrganicClicks: number
	strength: number
	totalInverseRank: number
}

export interface IDomainCompetitor {
	domain: string
	commonTerms: number
}

export interface IKeyword {
	keyword: string
	searchVolume: number
	rankingDifficulty: number
	totalMonthlyClicks: number
	percentMobileSearches: number | null
	percentDesktopSearches: number | null
	percentSearchesNotClicked: number | null
	percentPaidClicks: number | null
	percentOrganicClicks: number | null
	broadCostPerClick: number | null
	phraseCostPerClick: number | null
	exactCostPerClick: number | null
	broadMonthlyClicks: number
	phraseMonthlyClicks: number | null
	exactMonthlyClicks: number
	broadMonthlyCost: number
	phraseMonthlyCost: number | null
	exactMonthlyCost: number
	paidCompetitors: number
	distinctCompetitors: string[]
	rankingHomepages: number
	serpFeaturesCsv: string | null
	serpFirstResult: string
	isQuestion: boolean
	isNotSafeForWork: boolean
	adPosition: number | null
}


export interface IResponse<T> extends BaseResponse {
	results: T[]
}

export interface IDomainStatsResponse extends BaseResponse, IResponse<IDomainStats> {
	domain: string
}

export interface IOrganicKombatKeywordResponse extends BaseResponse, IResponse<IKeyword> {
	totalMatchingResults: number
}
export interface IDomainCompetitorResponse extends BaseResponse, IResponse<IDomainCompetitor> {
	totalMatchingResults: number
}

export interface IKeywordsResearchResponse extends BaseResponse, IResponse<IKeyword> {
	totalMatchingResults: number
}
