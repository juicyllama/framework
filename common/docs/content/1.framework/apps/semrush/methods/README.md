# Methods

The following methods are available:

## Domain VS Domain

```ts
// app.service.ts
import { DomainReportService } from '@juicyllama/app-semrush'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => DomainReportService)) private readonly domainReportService: DomainReportService) {}

	async domainComparison() {
		const request: DomainVsDomainParams = {
        	domains: "+|or|google.com|+|or|yahoo.com|+|or|bing.com|+|or|baidu.com", // Max 5 values
        	database: "us",
        	display_limit: 250,
        	display_date: "20231012",
        	export_columns: "Ph,P0,P1,P2,P3,Co,Nq,Cp,Kd",
        	export_decode: 1,
        	export_escape: 1,
        	display_sort: "p0_desc",
        	display_filter: "P0",
		}
		const response = await this.domainReportService.domainVsDomain(request)

    	// resonse = [
    	//     {
    	// 	    "keyword": "webdriver",
    	// 	    "testqualityCom": "0",
    	// 	    "businessanalysisexpertsCom": "0",
    	// 	    "behatOrg": "0",
    	// 	    "cucumberIo": "84",
    	// 	    "competition": "0.00",
    	// 	    "searchVolume": "1000000",
    	// 	    "cPC": "2.30",
    	// 	    "keywordDifficulty": "92.00"
    	//     },
    	//     {
    	// 	    "keyword": "cucumber",
    	// 	    "testqualityCom": "0",
    	// 	    "businessanalysisexpertsCom": "0",
    	// 	    "behatOrg": "0",
    	// 	    "cucumberIo": "3",
    	// 	    "competition": "0.89",
    	// 	    "searchVolume": "90500",
    	// 	    "cPC": "0.06",
    	// 	    "keywordDifficulty": "92.00"
    	//     },
        //     ...]
	}
}
```

## Domain Organic Search Keywords

```ts
// app.service.ts
import { DomainReportService } from '@juicyllama/app-semrush'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => DomainReportService)) private readonly domainReportService: DomainReportService) {}

	async domainOrganicSearchKeywords() {
		const request: DomainOrganicSearchKeywordsParams = {
            domain: "google.com",
            database: "us",
            display_limit: 20,
            display_offset: 18,
            display_date: "20231012",
            display_daily: 1,
            display_positions: "rise",
            display_positions_type: "all",
            export_columns: "Ph,P0,P1,P2,P3,Co,Nq,Cp,Kd",
            export_escape: 1,
            display_sort: "p0_desc",
            display_filter: "p0"
		}
		const response = await this.domainReportService.domainOrganicSearchKeywords(request)

		// response = [
        // 	    {
        // 	    	"keyword": "gmail",
        // 	    	"competition": "0.00",
        // 	    	"searchVolume": "720",
        //     		"cPC": "0.00",
        //     		"keywordDifficulty": "55.00"
        //     	},
        //     	{
        //     		"keyword": "maps",
        //     		"competition": "0.00",
        //     		"searchVolume": "260",
        //     		"cPC": "0.00",
        //     		"keywordDifficulty": "19.00"
        // 	    },
        //      ...]
	}
}
```

## Competitors in Organic Search

```ts
// app.service.ts
import { DomainReportService } from '@juicyllama/app-semrush'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => DomainReportService)) private readonly domainReportService: DomainReportService) {}

	async getCompetitors() {
		const request: CompetitorsInOrganicSearchParams = {
            domain: "google.com"
        	database: "us"
        	display_limit: 10
            display_offset: 0
        	display_date: string
        	export_columns: "Dn,Cr,Np,Or,Ot,Oc,Ad,Sr,St,Sc"
        	export_escape: 1
            export_decode: 1
        	display_sort: "np_desc"
        }
		const response = await this.domainReportService.competitorsInOrganicSearch(request)

		// response = [
        //     {
        // 	    	"domain": "yahoo.org",
        // 	    	"competitorRelevance": "0.28",
        // 		    "commonKeywords": "28",
        // 		    "organicKeywords": "208",
        //     		"organicTraffic": "566",
        //     		"organicCost": "79",
        //     		"adwordsKeywords": "0"
        //     	},
        //     	{
        // 	    	"domain": "bing.com",
        // 	    	"competitorRelevance": "0.23",
        // 	    	"commonKeywords": "32",
        // 	    	"organicKeywords": "1290",
        // 	    	"organicTraffic": "1231",
        // 	    	"organicCost": "675",
        // 	    	"adwordsKeywords": "0"
        // 	    },
        //      ...]
	}
}
```

## Authority score profile

```ts
// app.service.ts
import { BacklinksService } from '@juicyllama/app-semrush'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => BacklinksService)) private readonly backlinksService: BacklinksService) {}

	async getAuthorityScore() {
		const request: AuthorityScoreParams = {
           target_type: "root_domain",
           target: "https://google.com"
        }
		const response = await this.backlinksService.authorityScore(request)

	    // response = [
        //     {
	    // 	       "ascore": "0",
	    // 	       "domainsNum": "6"
	    //     },
	    //     {
	    // 	       "ascore": "2",
	    // 	       "domainsNum": "75"
	    //     },
        //     ...]
	}
}
```
