import { Integrations } from "../types/integrations";
import { Stack } from "../types/stack";

export default [{
    "id": "JL-00001",
    "title": "Automatically syndicate blog content to social media accounts",
    "handle": "blog-content-to-social-media",
    "what": "Our client would like to ensure maximum value from the SEO content being produced, including automatically syndicating to social media profiles as videos and posts in the correct format for each social network.",
    "why": "Reducing costs for marketing blog content and improve predictable outcomes",
    "cost_benefit": "3 hours per article",
    "solution": "Create workflow that when a new post is added to the blog on Shopify it uses AI tooling to craft videos / posts and automatically posts them to their different social media networks. We use Buffer to spread out the posts and ensure they can handle content automation upstream.",
    "stack": [Stack.N8N],
    "integrations": [Integrations.SHOPIFY, Integrations.BUFFER, Integrations.OPENAI, Integrations.CREATIFY]
}
//,{
//     "id": "JL-00002",
//     "title": "Automate weekly newsletter from blog content",
//     "handle": "blog-content-to-weekly-newsletter",
//     "what": "Our client would like to drive traffic to new content and keep their email lists warm by sending a weekly newsletter with any blog posts uploaded.",
//     "why": " ",
//     "cost_benefit": "",
//     "solution": "",
//     "stack": [Stack.N8N],
//     "integrations": []
// }
,{
"id": "JL-00046",
    "title": "Weekly Inventory Report with Sales Performance",
    "handle": "weekly-investory-reporting-sales-performance",
    "what": "The client would like to have a weekly report of their inventory levels combined with sales performance to project how long (days) worth of stock they have available, they would like a traffic light system based on their order timeframes to alert when new stock should be placed.",
    "why": "To improve stock management and reduce stockouts",
    "cost_benefit": "Thousands of dollars in stockouts",
    "solution": "We connect to their Shopify store and pull in sales data, we then use a custom algorithm to project how long stock will last based on current sales performance. We pull investory levels from Shipbob and combine the data to send the traffic light report to Slack each week.",
    "stack": [Stack.N8N],
    "integrations": [
        Integrations.SHOPIFY, Integrations.SLACK, Integrations.SHIPBOB, Integrations.GOOGLE_SHEETS
    ]
},{
    "id": "JL-00007",
        "title": "SEO Traffic Light Reporting",
        "handle": "seo-traffic-light-reporting",
        "what": "We were asked to create a weekly report that would show the SEO performance of the website and how it's is tracking against the KPIs set by the client over time.",
        "why": "To monitor SEO performance and ensure the website is gaining traffic over time",
        "cost_benefit": "2-3 Hours per week of manual reporting",
        "solution": "Data is collected from Google Analytics, Spyfu and DataforSEO, we populate the data in Google Sheets and use a custom algorithm to calculate the traffic light system. We then send the report to Slack each week.",
        "stack": [Stack.N8N],
        "integrations": [
            Integrations.GOOGLE_ANALYTICS, Integrations.GOOGLE_SHEETS, Integrations.SLACK, Integrations.SPYFU, Integrations.DATAFORSEO
        ]
    }
]

/*
    "id": "JL-00001",
    "title": "",
    "handle": "",
    "what": "",
    "why": " ",
    "cost_benefit": "",
    "solution": "",
    "stack": [Stack.N8N],
    "integrations": []
**/
