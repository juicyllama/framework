# Utils

The following utils are available to be imported via the `@juicyllama/utils` package.

## Api

Perform API calls with a single command, the util handles all the logging and error handling for you.

[Get](#get) | [Post](#post) | [Patch](#patch) | [Put](#put) | [Delete](#delete)

```ts
import { Api } from '@juicyllama/utils'
```

#### Get

Perform a get request with the given options:

```ts
const result = await Api.get('logging::domain', 'https://example.com')
```

#### Post

Perform a post request with the given options:

```ts
const result = await Api.post('logging::domain', 'https://example.com', {
	//data to post
})
```

#### Patch

Perform a patch request with the given options:

```ts
const result = await Api.patch('logging::domain', 'https://example.com', {
	//data to patch
})
```

#### Put

Perform a patch request with the given options:

```ts
const result = await Api.put('logging::domain', 'https://example.com', {
	//data to put
})
```

#### Delete

Perform a delete request with the given options:

```ts
const result = await Api.delete('logging::domain', 'https://example.com')
```

## Cache

The cache utils helps with creating cache keys for your application.

[CacheKey](#cacheKey) | [CacheKeyFromRoute](#cacheKeyFromRoute)

```ts
import { JLCache } from '@juicyllama/utils'
```

#### CacheKey

Create a cache key from the given domain and optional params:

```ts
const domain = 'module::serivce::function'
const params = {
	id: 1,
	name: 'test',
}

const cacheKey = JLCache.CacheKey(domain, params)
//cacheKey = 'module::serivce::function::id::1::name::test'
```

#### CacheKeyFromRoute

Create a cache key from the given route and optional query params:

```ts
// Request to : /test?id=1
@Get('/test')
example(@Req req, @Query query){
    const cacheKey = JLCache.CacheKeyFromRoute(req.route.path, query)
    //cacheKey = 'route::test/?id=1'
}
```

## Color

Here are some utils for working with colors

[lightOrDark](#lightOrDark)

```ts
import { Color } from '@juicyllama/utils'
```

#### LightOrDark

Checks if a color is light or dark, allowing you to set the text color to match the background color.

```ts
let color = '#ffffff'
let shade = Color.lightOrDark(color)
//shade = 'light'

color = '#000000'
shade = Color.lightOrDark(color)
//shade = 'dark'
```

## Countries

Helper utils for working with country data

[convertISO2ToISO3](#convertISO2ToISO3)

```ts
import { Countries } from '@juicyllama/utils'
```

#### GetCountry

Get a country by ISO2 code

```ts
const iso2 = 'US'
const country = Countries.getCountry(iso2)
//{
//      "Country Name": "United States",
// 	"ISO2": "US",
// 	"ISO3": "USA",
// 	"Top Level Domain": "us",
// 	"FIPS": "US",
// 	"ISO Numeric": 840,
// 	"GeoNameID": 6252001,
// 	"E164": 1,
// 	"Phone Code": 1,
// 	"Continent": "North America",
// 	"Capital": "Washington",
// 	"Time Zone in Capital": "America/New_York",
// 	"Currency": "Dollar",
// 	"Language Codes": "en-US,es-US,haw,fr",
// 	"Languages": "English 82.1%, Spanish 10.7%, other Indo-European 3.8%, Asian and Pacific island 2.7%, other 0.7% (2000 census)",
// 	"Area KM2": 9629091,
// 	"Internet Hosts": 505000000,
// 	"Internet Users": 245000000,
// 	"Phones (Mobile)": 310000000,
// 	"Phones (Landline)": 139000000,
// 	"GDP": 16720000000000
// },
```

#### ConvertISO2ToISO3

Pass a ISO2 country code and get the ISO3 code back:

```ts
const iso2 = 'US'
const iso3 = Countries.convertISO2ToISO3(iso2)
//iso3 = 'USA'
```

#### CountryNameToISO2

Pass a country name and get back the ISO2 value:

```ts
const name = 'United States'
const iso2 = Countries.countryNameToISO2(name)
//iso2 = 'US'
```

## Dates

Helper utils for working with dates

[format](#format) | [formatZerolessValue](#formatZerolessValue) | [addDays](#addDays) | [addStep](#addStep) | [lastMonth](#lastMonth) | [isBetween](#isBetween) | [nextDate](#nextDate)

```ts
import { Dates } from '@juicyllama/utils'
```

#### Format

Pass a date and the format you would like to get back:

```ts
const example = new Date('2000-01-01')
const exampleFormatted = Dates.format(example, 'MM/DD/YYYY')
//exampleFormatted = '01/01/2000'
```

#### FormatZerolessValue

Ensures the number you pass is at least 2 digits long, if it is not it will add a zero to the front:

```ts
const twoDigits = Dates.formatZerolessValue(1)
//twoDigits = '01'
```

#### AddDays

Add days to a date:

```ts
const example = new Date('2000-01-01')
const examplePlusDays = Dates.addDays(example, 1)
//examplePlusDays = '2000-01-02'
```

#### AddStep

Add a step to a date:

```ts
const example = new Date('2000-01-01')
const examplePlusStep = Dates.addStep(example, StepType.MONHTHS, 2)
//examplePlusStep = '2000-03-01'
```

#### LastMonth

Get the date range of the last month (calculated from `now()`):

```ts
const lastMonth = Dates.lastMonth()
//lastMonth = {
//  from: '2000-01-01 00:00:00',
//  to: '2000-01-31 23:59:59'
//}
```

#### IsBetween

Check if a date is between two dates:

```ts
const example = new Date('2000-01-01')
const isBetween = Dates.isBetween(example, '2000-01-01', '2000-01-31')
//isBetween = true
```

#### NextDate

Get the next date of a given SubscriptionFrequency:

```ts
const nextDate = Dates.nextDate(SubscriptionFrequency.MONTHLY)
//nextDate = '2000-02-01'
```

## Emails

Helper utils for working with emails

[maskEmail](#maskEmail)

```ts
import { Emails } from '@juicyllama/utils'
```

#### MaskEmail

Mask an email address:

```ts
const email = 'example@domain.com'
const maskedEmail = Emails.maskEmail(email)
//maskedEmail = 'e****e@d*****n.com'
```

## Enums

Helper utils for working with enums

[getKeyName](#getKeyName) | [toArray](#toArray)

```ts
import { Enums } from '@juicyllama/utils'
```

#### GetKeyName

Get the key name of an enum value:

```ts
enum Example {
	ONE = 1,
	TWO = 2,
	THREE = 3,
}
const getKeyName = Enums.getKeyName(Example, 1)
//getKeyName = 'ONE'
```

#### ToArray

Convert an enum to an array:

```ts
enum Example {
	ONE = 1,
	TWO = 2,
	THREE = 3,
}

const enumArray = Enums.toArray(Example)

//enumArray = [
//  { key: 'ONE', value: 1 },
//  { key: 'TWO', value: 2 },
//  { key: 'THREE', value: 3 }
//]
```

## Env

Helper utils for working with environment types

[get](#get) | [IsProd](#isProd) | [IsDev](#isDev) | [IsTest](#isTest) | [IsNotTest](#isNotTest) | [IsNotProd](#isNotProd) | [IsSandbox](#isSandbox) | [ReadEnvVars](#readEnvVars) | [GetEnvValue](#getEnvValue) | [SetEnvValue](#setEnvValue)

```ts
import { Env } from '@juicyllama/utils'
```

#### Get

Get the current environment type:

```ts
const env = Env.get()
//env = 'development'
```

#### IsProd

Check if the current environment is production:

```ts
const isProd = Env.isProd()
//isProd = false
```

#### IsDev

Check if the current environment is development:

```ts
const isDev = Env.isDev()
//isDev = true
```

#### IsTest

Check if the current environment is test:

```ts
const isTest = Env.isTest()
//isTest = false
```

#### IsNotTest

Check if the current environment is not test:

```ts
const isNotTest = Env.isNotTest()
//isNotTest = true
```

#### IsNotProd

Check if the current environment is not production:

```ts
const isNotProd = Env.isNotProd()
//isNotProd = true
```

#### IsSandbox

Check if the current environment is sandbox:

```ts
const isSandbox = Env.isSandbox()
//isSandbox = false
```

#### ReadEnvVars

Read environment variables from a file:

```ts
const envVars = Env.readEnvVars()
//envVars = {
//  NODE_ENV: 'development',
//  PORT: '3000'
//}
```

#### GetEnvValue

Get an environment variable:

```ts
const envVar = Env.getEnvValue('NODE_ENV')
//envVar = 'development'
```

#### SetEnvValue

Set an environment variable:

```ts
Env.setEnvValue('NODE_ENV', 'production')
```

## Functions

Helper utils for working with functions

[whoIsMyDaddy](#whoIsMyDaddy)

```ts
import { Functions } from '@juicyllama/utils'
```

#### WhoIsMyDaddy

Get the name of the function that called the function you are in:

```ts
const whoIsMyDaddy = Functions.whoIsMyDaddy()
//whoIsMyDaddy = 'parentName'
```

## Geocoding

Helper utils for working with geocoding

[areCoordinatesInBoundingBox](#areCoordinatesInBoundingBox)

```ts
import { Geocoding } from '@juicyllama/utils'
```

#### AreCoordinatesInBoundingBox

Check if coordinates are in a bounding box:

```ts
const coordinates = {
	latitude: 51.5074,
	longitude: 0.1278,
}

const boundingBox = {
	north: 50.5074,
	east: 1.1275,
	south: 52.5074,
	west: 0.128,
}

const areCoordinatesInBoundingBox = Geocoding.areCoordinatesInBoundingBox(coordinates, boundingBox)
//areCoordinatesInBoundingBox = true
```

#### AreCoordinatesBetweenTwoPoints

Check if coordinates are between two points:

```ts
const coordinates = {
	latitude: 51.5074,
	longitude: 0.1278,
}

const northeast: Coordinates = {
	latitude: 58.565119,
	longitude: -11.397972,
}

const southwest: Coordinates = {
	latitude: 49.88128,
	longitude: 3.666387,
}

const areCoordinatesBetweenTwoPoints = Geocoding.areCoordinatesBetweenTwoPoints(coordinates, northeast, southwest)
//areCoordinatesBetweenTwoPoints = true
```

## Locale

Here are some helper functions for locale information

#### GetLocale

```ts
const locale = new Locale()
const result = locale.getLocale()
//result = 'en-GB'
```

#### GetCountry

```ts
const locale = new Locale()
const country = locale.getCountry()
//country = 'GB'
```

#### GetLanguage

```ts
const locale = new Locale()
const language = locale.getLanguage()
//language = 'en'
```

## Logger

Helper utils for working with logging

::alert{type="info"}
This is used across all JuicyLlama packages
::

```ts
import { Logger } from '@juicyllama/utils'
```

#### data

Log data out:

```ts
Logger.data('example', { foo: 'bar' })
//[example]=>{ foo: 'bar' }
```

#### error

Log an error out:

```ts
Logger.error('ERROR')
//\x1b[31m ERROR \x1b[0m
```

#### warn

Log a warning out:

```ts
Logger.warn('WARNING')
//\x1b[33m WARNING \x1b[0m
```

#### log

Log a message out:

```ts
Logger.log('LOG')
//\x1b[32m LOG \x1b[0m
```

#### debug

Log a debug message out:

```ts
Logger.debug('DEBUG')
//\x1b[35m DEBUG \x1b[0m
```

#### verbose

Log a verbose message out:

```ts
Logger.verbose('VERBOSE')
//\x1b[36m VERBOSE \x1b[0m
```

#### table

Log a table out:

```ts
Logger.table([{ foo: 'bar' }])
//┌─────────┬──────┐
//│ (index) │ foo  │
//├─────────┼──────┤
//│    0    │ bar  │
//└─────────┴──────┘
```

## Markdown

Helper utils for working with markdown

[markdownToHTML](#markdownToHTML)

```ts
import { Markdown } from '@juicyllama/utils'
```

#### MarkdownToHTML

Convert markdown to HTML:

```ts
const markdown = '# Hello World'
const html = Markdown.markdownToHTML(markdown)
//html = '<h1>Hello World</h1>'
```

## Modules

Helper utils for working with modules

[IsInstalled](#isInstalled)

```ts
import { Modules } from '@juicyllama/utils'
```

#### IsInstalled

Check if a module is installed:

```ts
const isInstalled = await Modules.slack.isInstalled
//isInstalled = true
```

## Numbers

Helper utils for working with numbers

[amountToCents](#amountToCents) | [toCurrency](#toCurrency) | [toFinancial](#toFinancial)

```ts
import { Numbers } from '@juicyllama/utils'
```

#### AmountToCents

Convert an amount to cents:

```ts
const amount = 10.99
const cents = Numbers.amountToCents(amount)
//cents = 1099
```

#### ToCurrency

Convert a number to a currency string:

```ts
const amount = 10.99
const currency = Numbers.toCurrency(amount, SupportedCurrencies.USD)
//currency = '$10.99'
```

#### ToFinancial

Convert a number to a financial string:

```ts
const amount = 10
const financial = Numbers.toFinancial(amount)
//financial = '10.00'
```

## OTP

Helper utils for working with one time passwords

[generateVerificationCode](#generateVerificationCode)

```ts
import { OTP } from '@juicyllama/utils'
```

#### GenerateVerificationCode

Generate a numerical verification code of a given length:

```ts
const verificationCode = OTP.generateVerificationCode(6)
//verificationCode = '123456'
```

## Phone

Helper utils for working with phone numbers

[internationalCode](#internationalCode)

```ts
import { Phone } from '@juicyllama/utils'
```

#### InternationalCode

Get the international code for a country:

```ts
const internationalCode = Phone.internationalCode('GB')
//internationalCode = '44'
```

## Poll

Helper utils for working with polling

[url](#url) | [function](#function)

```ts
import { Poll } from '@juicyllama/utils'
```

#### Url

Poll a URL:

```ts
const data = await Poll.url('https://example.com')
//data = { foo: 'bar' }
```

#### Function

Poll a function:

```ts
const validate = val => {
	val.foo === 'bar'
}

const func = async () => {
	return await Api.get('https://example.com')
}

const data = await Poll.function(func, validate)
//data = { foo: 'bar' }
```

## Random

Helper utils for working with random data

[LlamaFact](#LlamaFact)

```ts
import { Random } from '@juicyllama/utils'
```

#### LlamaFact

Get a random llama fact:

```ts
const llamaFact = Random.llamaFact()
//llamaFact = 'Llamas are very intelligent and can be trained to do tricks.'
```

## Security

Helper utils for working with security

[hashPassword](#hashPassword) | [referrerCheck](#referrerCheck)

```ts
import { Security } from '@juicyllama/utils'
```

#### HashPassword

Hash a password:

```ts
const hashedPassword = await Security.hashPassword('test')
//hashedPassword = 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff'
```

#### ReferrerCheck

Check if a referrer is valid:

```ts
const referrer = 'https://example.com'
const domain = 'https://example.com'
const isValid = Security.referrerCheck(referrer, domain)
//isValid = true
```

## Stopwatch

Helper utils for working with stopwatches

::alert{type="info"}
This is useful for crons or long running processes to track how long they take
::

```ts
import { Stopwatch } from '@juicyllama/utils'
const stopwatch = new Stopwatch('test')
stopwatch.start()
//[test][⏱️] Starting stopwatch
stopwatch.check()
//[test][⏱️] Checking stopwatch: 0.1
const result = stopwatch.stop()
//[test][⏱️] Stopping stopwatch: 0.2

//result = 0.2
```

## Strings

Helper utils for working with strings

[capitalize](#capitalize) | [replacer](#replacer) | [numbersToLetters](#numbersToLetters) | [numbersTo26Letters](#numbersTo26Letters) | [toHTMLConversion](#toHTMLConversion) | [fromHTMLtoStringConversion](#fromHTMLtoStringConversion) | [az09Lowercase](#az09Lowercase) | [onlyNumbers](#onlyNumbers) | [plural](#plural)

```ts
import { Strings } from '@juicyllama/utils'
```

#### Capitalize

Capitalize a string:

```ts
const capitalized = Strings.capitalize('hello')
//capitalized = 'Hello'
```

#### Replacer

Replace all occurrences of a string

```ts
const template = `My name is ${name.toUpperCase()}`
const object = {
	name: 'John',
}
const replaced = Strings.replacer(template, object)
//replaced = 'My name is John'
```

#### NumbersToLetters

Convert a number to letters:

```ts
const letters = Strings.numbersToLetters(123)
//letters = 'ABC'
```

#### NumbersTo26Letters

Convert a number to letters using the 26 letters of the alphabet:

```ts
const letters = Strings.numbersTo26Letters(3)
//letters = 'C'
```

#### ToHTMLConversion

Convert a string to HTML:

```ts
const html = Strings.toHTMLConversion('Hello \n World')
//html = 'Hello <br />World'
```

#### FromHTMLtoStringConversion

Convert HTML to a string:

```ts
const string = Strings.fromHTMLtoStringConversion('<h1>Hello World</h1>')
//string = 'Hello World'
```

#### Az09Lowercase

Convert a string to lowercase and remove all non alphanumeric characters:

::alert{type="warning"}
Currently only supports spaces and dashes, useful for slugs
::

```ts
const string = Strings.az09Lowercase('Hello World - welcome')
//string = 'helloworldwelcome'
```

#### OnlyNumbers

Remove all non-numeric characters from a string:

```ts
const string = Strings.onlyNumbers('1beep2boop3')
//string = '123'
```

#### plural

Pluralize a string:

```ts
const string = Strings.plural('cat', 2)
//string = '2 cats'
```
