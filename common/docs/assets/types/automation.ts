import { Stack } from "./stack";
import { Integrations } from "./integrations";

export type Automation = {
"id": string
"title": string
"handle": string
"what": string
"why": string
"cost_benefit": string
"solution": string
"stack": Stack[],
"integrations": Integrations[]
}