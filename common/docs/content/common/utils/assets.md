# Assets

Some common assets which you can use in your projects.

## Dialing Codes

A list of all the dailing codes for countries around the world.

#### Usage

```typescript
import { dialingCodes } from '@juicyllama/utils'
const country = dialingCodes.find((code) => code.code === '44').name
// country = 'United Kingdom'

const code = dialingCodes['US'].dialling_code
// code = '1'
```

#### Format

```json
{
    "US": {
        "name": "United States",
        "dialling_code": "1"
    }
}
```

## Llama Facts

A list of facts about llamas.

#### Usage

```typescript
import { llamaFacts } from '@juicyllama/utils'
const fact = llamaFacts[Math.floor(Math.random() * llamaFacts.length)]
// fact = 'Llamas are the only South American camelids that can spit.'
```

#### Format

```json
[
    "Lama Glama is the llama’s scientific name.",
    "A young or baby llama is called Cria.",
    "Its predators are coyotes, mountain lions, ocelots, and humans."
]
```