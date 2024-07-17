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
},{
    "id": "JL-00002",
    "title": "Automate weekly newsletter to customers from blog content",
    "handle": "blog-content-to-weekly-newsletter",
    "what": "Our client would like to drive traffic to new content and keep their email lists warm by sending a weekly newsletter with blog posts uploaded in the last week.",
    "why": "Keep customers engaged and drive traffic to new content",
    "cost_benefit": "Hours saved in manual work and large increase in campaign revenue due to engaged audience",
    "solution": "A workflow which collects any new blog posts from the last week, it then builds a newsletter template, creates the Klaviyo campaign, assigns the newsletter and creates the send job. Finally it sends a slack message with a link to the new campaign.",
    "stack": [Stack.N8N],
    "integrations": [Integrations.KLAVIYO, Integrations.SHOPIFY, Integrations.SLACK]
},{
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
    },
    {
        "id": "JL-00050",
            "title": "Affiliate Off Boarding Automation",
            "handle": "affiliate-off-boarding-automation",
            "what": "Our client wanted to automate the offboarding of affiliates who have not sent any traffic in the last 90 days.",
            "why": "To keep their affiliate program clean and ensure they are not investing resources in tooling for people who are not sending traffic.",
            "cost_benefit": "Thousands of dollars in wasted resources",
            "solution": "We built an automation flow which finds affiliates who have not sent traffic in the last 90 days from their everflow system. It does some checks and filtering to ensure no false positives. It checks if the affiliate has an active profile with Klaviyo and if they do, it supresses their email. It checks if the affiliate has an account on their Slack community, and if so, removes the user. It then removes them from the everflow system. Finally it send the client a nice summary of which users have been removed from which systems.",
            "stack": [Stack.N8N],
            "integrations": [
                Integrations.EVERFLOW, Integrations.KLAVIYO, Integrations.SLACK
            ]
        },
        {
            "id": "JL-00051",
                "title": "Daily Sales Report",
                "handle": "daily-sales-report",
                "what": "Our client wanted a easy to digest sales report delivered daily to their slack channel.",
                "why": "To understand how the sales performed yesterday, across different stores and also marketplaces.",
                "cost_benefit": "Thousands of dollars in wasted resources",
                "solution": "We built an automation flow which pulled in sales data from Shopify (which also collected sales from Marketplaces). We split out shopify and marketplaces sales along with showing totals. Finally delivering the report to their slack channel.",
                "stack": [Stack.N8N],
                "integrations": [
                    Integrations.SHOPIFY, Integrations.SLACK
                ]
            },
            {
                "id": "JL-00048",
                    "title": "Ecommerce Traffic Light Reporting",
                    "handle": "ecommerce-traffic-light-reporting",
                    "what": "Deliver an easy to digest report showing ecommerce perfomance over time.",
                    "why": "To monitor ecommerce performance and ensure the revenue is increasing over time.",
                    "cost_benefit": "Thousands of dollars in wasted resources",
                    "solution": "We build an automation flow which pulled in sales data from both Shopify and Recharge. We broke down the data into different categories and time periods. Finally sending the traffic light report to their slack channel.",
                    "stack": [Stack.N8N],
                    "integrations": [
                        Integrations.SHOPIFY, Integrations.SLACK, Integrations.RECHARGE, Integrations.GOOGLE_SHEETS
                    ]
                },
                {
                    "id": "JL-00011",
                        "title": "Affiliate Traffic Light Reporting",
                        "handle": "affiliate-traffic-light-reporting",
                        "what": "Deliver an easy to digest report showing affiliate perfomance over time.",
                        "why": "To monitor affiliate performance and ensure it is increasing over time.",
                        "cost_benefit": "Thousands of dollars in wasted resources",
                        "solution": "We build an automation flow which pulled in affiliate data from Everflow. We broke down the data into different categories and time periods. Finally sending the traffic light report to their slack channel.",
                        "stack": [Stack.N8N],
                        "integrations": [
                            Integrations.EVERFLOW, Integrations.SLACK, Integrations.GOOGLE_SHEETS
                        ]
                    },
                    {
                        "id": "JL-00047",
                            "title": "CRO Traffic Light Reporting",
                            "handle": "cro-traffic-light-reporting",
                            "what": "Deliver an easy to digest report showing how well the website is perfoming over time.",
                            "why": "To see if our conversino rate optimisation work is adding value and increasing revenue.",
                            "cost_benefit": "Hours saved each week in manual reporting time.",
                            "solution": "We built an automation flow which pulled in website data from Google Analytics. We broke down the data into different categories and time periods. Finally sending the traffic light report to their slack channel.",
                            "stack": [Stack.N8N],
                            "integrations": [
                                Integrations.GOOGLE_ANALYTICS, Integrations.SLACK, Integrations.GOOGLE_SHEETS
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
