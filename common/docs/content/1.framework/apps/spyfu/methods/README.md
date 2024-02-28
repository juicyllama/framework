# Methods

The following methods are available:

## Get Competitors

```ts
// app.service.ts
import { CompetitorsService } from '@juicyllama/app-spyfu'

@Injectable()
export class AppService {
	constructor(
		@Inject(forwardRef(() => CompetitorsService)) private readonly competitorsService: CompetitorsService,
	) {}

	async getSeoDomainCompetitors() {
		const request: SEODomainCompetitor = {
			domain: "google.com"
	        countryCode: "US"
	        pageSize: 5
	        startingRow: 2
		}
		const response = await this.competitorsService.seoDomainCompetitors(request)

		// resonse = {
        // 	"resultCount": 5,
        // 	"totalMatchingResults": 51,
        // 	"results": [
        // 		{
        // 			"domain": "youtube.com",
        // 			"commonTerms": 41615279
        // 		},
        // 		{
        // 			"domain": "reddit.com",
        // 			"commonTerms": 31244627
        // 		},
        // 		{
        // 			"domain": "wikipedia.org",
        // 			"commonTerms": 27814112
        // 		},
        // 		{
        // 			"domain": "facebook.com",
        // 			"commonTerms": 29617999
        // 		},
        // 		{
        // 			"domain": "amazon.com",
        // 			"commonTerms": 22529489
        // 		}
        // 	]
        // }
	}
}
```

## Latest Domain Stats

```ts
// app.service.ts
import { DomainStatsService } from '@juicyllama/app-spyfu'

@Injectable()
export class AppService {
	constructor(
		@Inject(forwardRef(() => DomainStatsService)) private readonly domainStatsService: DomainStatsService,
	) {}

	async getDomainStats() {
		const request: LatestDomainStatsParams = {
			domain: "google.com"
	        countryCode: "US"
		}
		const response = await this.domainStatsService.latest(request)

		// response = {
        // 	"resultCount": 1,
        // 	"domain": "google.com",
        // 	"results": [
        // 		{
        // 			"searchMonth": 1,
        // 			"searchYear": 2024,
        // 			"averageOrganicRank": 70.3,
        // 			"monthlyPaidClicks": 1414999.9999999998,
        // 			"averageAdRank": 1.5,
        // 			"totalOrganicResults": 217800000,
        // 			"monthlyBudget": 8505000,
        // 			"monthlyOrganicValue": 250699999.99999997,
        // 			"totalAdsPurchased": 54610,
        // 			"monthlyOrganicClicks": 366400000,
        // 			"strength": 74,
        // 			"totalInverseRank": 955500000
        // 		}
        // 	]
        // }
	}
}
```

## Organic Keywords based on competitors

```ts
// app.service.ts
import { KombatService } from '@juicyllama/app-spyfu'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => KombatService)) private readonly kombatService: KombatService) {}

	async getKeywords() {
		const request: OrganicKombatKeywordParams = {
        	includeDomainsCsv: "yahoo.com,bing.com,baidu.com"
        	excludeDomainsCsv: "google.com"
        	isIntersection: "False"
        	sortBy: "RankingDifficulty"
        	sortOrder: "Descending"
        	startingRow: 2
        	pageSize: 5
        	countryCode: "US"
        	adultFilter: "False"
        }
		const response = await this.kombatService.organicKeyword(request)

		// response = {
        // 	"resultCount": 5,
        // 	"totalMatchingResults": 33384150,
        // 	"results": [
        // 		{
        // 			"keyword": "\"us\"",
        // 			"searchVolume": 600,
        // 			"rankingDifficulty": 100,
        // 			"totalMonthlyClicks": 270,
        // 			"percentMobileSearches": 0.311914548404543,
        // 			"percentDesktopSearches": 0.688085451595457,
        // 			"percentSearchesNotClicked": 0.534883720930232,
        // 			"percentPaidClicks": null,
        // 			"percentOrganicClicks": null,
        // 			"broadCostPerClick": 0.54,
        // 			"phraseCostPerClick": null,
        // 			"exactCostPerClick": null,
        // 			"broadMonthlyClicks": null,
        // 			"phraseMonthlyClicks": null,
        // 			"exactMonthlyClicks": null,
        // 			"broadMonthlyCost": null,
        // 			"phraseMonthlyCost": null,
        // 			"exactMonthlyCost": null,
        // 			"paidCompetitors": 0,
        // 			"distinctCompetitors": [],
        // 			"rankingHomepages": 60,
        // 			"serpFeaturesCsv": null,
        // 			"serpFirstResult": "imdb.com",
        // 			"isQuestion": false,
        // 			"isNotSafeForWork": false,
        // 			"adPosition": null
        // 		},
        // 		{
        // 			"keyword": "edu;",
        // 			"searchVolume": 720,
        // 			"rankingDifficulty": 100,
        // 			"totalMonthlyClicks": 360,
        // 			"percentMobileSearches": null,
        // 			"percentDesktopSearches": null,
        // 			"percentSearchesNotClicked": null,
        // 			"percentPaidClicks": null,
        // 			"percentOrganicClicks": null,
        // 			"broadCostPerClick": null,
        // 			"phraseCostPerClick": null,
        // 			"exactCostPerClick": null,
        // 			"broadMonthlyClicks": null,
        // 			"phraseMonthlyClicks": null,
        // 			"exactMonthlyClicks": null,
        // 			"broadMonthlyCost": null,
        // 			"phraseMonthlyCost": null,
        // 			"exactMonthlyCost": null,
        // 			"paidCompetitors": 1,
        // 			"distinctCompetitors": [
        // 				"wgu.edu"
        // 			],
        // 			"rankingHomepages": 81,
        // 			"serpFeaturesCsv": null,
        // 			"serpFirstResult": "wikipedia.org",
        // 			"isQuestion": false,
        // 			"isNotSafeForWork": false,
        // 			"adPosition": null
        // 		},
        // 		{
        // 			"keyword": "universidad internet",
        // 			"searchVolume": 5,
        // 			"rankingDifficulty": 100,
        // 			"totalMonthlyClicks": null,
        // 			"percentMobileSearches": null,
        // 			"percentDesktopSearches": null,
        // 			"percentSearchesNotClicked": null,
        // 			"percentPaidClicks": null,
        // 			"percentOrganicClicks": null,
        // 			"broadCostPerClick": 0.64,
        // 			"phraseCostPerClick": 0.78,
        // 			"exactCostPerClick": 0.8,
        // 			"broadMonthlyClicks": 20,
        // 			"phraseMonthlyClicks": 0.37,
        // 			"exactMonthlyClicks": 0,
        // 			"broadMonthlyCost": 12.67,
        // 			"phraseMonthlyCost": 0.37,
        // 			"exactMonthlyCost": 0.38,
        // 			"paidCompetitors": 4,
        // 			"distinctCompetitors": [
        // 				"apus.edu",
        // 				"umgc.edu",
        // 				"coloradotechonline.com",
        // 				"wgu.edu"
        // 			],
        // 			"rankingHomepages": 78,
        // 			"serpFeaturesCsv": null,
        // 			"serpFirstResult": "internetforall.gov",
        // 			"isQuestion": false,
        // 			"isNotSafeForWork": false,
        // 			"adPosition": null
        // 		},
        // 		{
        // 			"keyword": ": US",
        // 			"searchVolume": 480,
        // 			"rankingDifficulty": 100,
        // 			"totalMonthlyClicks": null,
        // 			"percentMobileSearches": null,
        // 			"percentDesktopSearches": null,
        // 			"percentSearchesNotClicked": null,
        // 			"percentPaidClicks": null,
        // 			"percentOrganicClicks": null,
        // 			"broadCostPerClick": 0.54,
        // 			"phraseCostPerClick": null,
        // 			"exactCostPerClick": null,
        // 			"broadMonthlyClicks": null,
        // 			"phraseMonthlyClicks": null,
        // 			"exactMonthlyClicks": null,
        // 			"broadMonthlyCost": null,
        // 			"phraseMonthlyCost": null,
        // 			"exactMonthlyCost": null,
        // 			"paidCompetitors": 0,
        // 			"distinctCompetitors": [],
        // 			"rankingHomepages": 61,
        // 			"serpFeaturesCsv": null,
        // 			"serpFirstResult": "wikipedia.org",
        // 			"isQuestion": false,
        // 			"isNotSafeForWork": false,
        // 			"adPosition": null
        // 		},
        // 		{
        // 			"keyword": "best schooling in usa",
        // 			"searchVolume": null,
        // 			"rankingDifficulty": 100,
        // 			"totalMonthlyClicks": null,
        // 			"percentMobileSearches": null,
        // 			"percentDesktopSearches": null,
        // 			"percentSearchesNotClicked": null,
        // 			"percentPaidClicks": null,
        // 			"percentOrganicClicks": null,
        // 			"broadCostPerClick": null,
        // 			"phraseCostPerClick": null,
        // 			"exactCostPerClick": null,
        // 			"broadMonthlyClicks": null,
        // 			"phraseMonthlyClicks": null,
        // 			"exactMonthlyClicks": null,
        // 			"broadMonthlyCost": null,
        // 			"phraseMonthlyCost": null,
        // 			"exactMonthlyCost": null,
        // 			"paidCompetitors": 5,
        // 			"distinctCompetitors": [
        // 				"antioch.edu",
        // 				"cornerstone.edu",
        // 				"purdue.edu",
        // 				"cn.edu",
        // 				"south.edu"
        // 			],
        // 			"rankingHomepages": 65,
        // 			"serpFeaturesCsv": null,
        // 			"serpFirstResult": "usnews.com",
        // 			"isQuestion": false,
        // 			"isNotSafeForWork": false,
        // 			"adPosition": null
        // 		}
        // 	]
        // }
	}
}
```