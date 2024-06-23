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
    "title": "Automate weekly newsletter from blog content",
    "handle": "blog-content-to-weekly-newsletter",
    "what": "Our client would like to drive traffic to new content and keep their email lists warm by sending a weekly newsletter with any blog posts uploaded.",
    "why": " ",
    "cost_benefit": "",
    "solution": "",
    "stack": [Stack.N8N],
    "integrations": []
}
]

/*
    "id": "JL-HN-00001",
    "title": "",
    "handle": "",
    "what": "",
    "why": " ",
    "cost_benefit": "",
    "solution": "",
    "stack": [stack.N8N],
    "integrations": []
**/
