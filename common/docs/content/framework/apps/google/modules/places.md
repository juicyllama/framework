# Geocoding

The Places module provides a wrapper around the Google Maps Places API.

For more information about this checkout the official [Google Maps Places API](https://developers.google.com/maps/documentation/places/web-service/overview){:target="_blank"}.

## Installation

Import the module into your project:

```ts
// app.module.ts
import { PlacesModule } from '@juicyllama/app-google'

@Module({
    imports: [
        forwardRef(() => PlacesModule),
    ],
})
```

## Usage

Inject the service into your application:

```ts
// app.service.ts
import { PlacesService } from '@juicyllama/app-google'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => PlacesService)) private readonly placesService: PlacesService) {}
}
```

## Methods

The service makes available the following methods:

### Get Place By Id

Returns the place data for a given place_id string.

```ts
// app.service.ts

const place_id = 'ChIJtV5bzSAFdkgRpwLZFPWrJgo' // Buckingham Palace
const place = await this.placesService.getPlaceById(place_id)
console.log(place)
```

```bash
{
        "address_components": [
            {
                "long_name": "London",
                "short_name": "London",
                "types": [
                    "postal_town"
                ]
            },
            {
                "long_name": "Greater London",
                "short_name": "Greater London",
                "types": [
                    "administrative_area_level_2",
                    "political"
                ]
            },
            {
                "long_name": "England",
                "short_name": "England",
                "types": [
                    "administrative_area_level_1",
                    "political"
                ]
            },
            {
                "long_name": "United Kingdom",
                "short_name": "GB",
                "types": [
                    "country",
                    "political"
                ]
            },
            {
                "long_name": "SW1A 1AA",
                "short_name": "SW1A 1AA",
                "types": [
                    "postal_code"
                ]
            }
        ],
        "adr_address": "<span class=\"locality\">London</span> <span class=\"postal-code\">SW1A 1AA</span>, <span class=\"country-name\">UK</span>",
        "business_status": "OPERATIONAL",
        "editorial_summary": {
            "language": "en",
            "overview": "Visitors can tour the palace's opulent private and state rooms or watch the changing of the guard."
        },
        "formatted_address": "London SW1A 1AA, UK",
        "formatted_phone_number": "0303 123 7300",
        "geometry": {
            "location": {
                "lat": 51.501364,
                "lng": -0.14189
            },
            "viewport": {
                "northeast": {
                    "lat": 51.5030205302915,
                    "lng": -0.13910645
                },
                "southwest": {
                    "lat": 51.5003225697085,
                    "lng": -0.14281785
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "international_phone_number": "+44 303 123 7300",
        "name": "Buckingham Palace",
        "photos": [
            {
                "height": 2736,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/115640553145201327025\">Freddie Reeves</a>"
                ],
                "photo_reference": "AZose0kXA6noPXoeOUfkLk8W9hNtiCj-XWBooFoobF84jzsXE9f0qoaRt9BqM9RsZVg2Ss9h-7aDCU0_BZdI9p1QF-TzV03vNwxsSW6mbAg4Qd6AgjjtP1XMEqYwXKZXNeTxbE6N0Fw_oFC-X6-RQpAtKY_FDXXtPbZICAYhZYuclOKCUKGy",
                "width": 3648
            },
            {
                "height": 2268,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/113669601452719869310\">Tal Surasky</a>"
                ],
                "photo_reference": "AZose0kC7RhTnmlcUcJ5qCnpvrxFwwQJdn8JRT57EJTRRNkbXi8Ot1xrdfzEypaTBYqzz3vzGMJ4tVIEEbOm2QICdZlpFBh-as6NK9gIlHDN4mU4CN8fHQOaM1GwrW-2fUROVTpWYHQjjL3xqRaoFwGsaxmBUx8lJazUiD-nRYLpEfCg8MUV",
                "width": 4032
            },
            {
                "height": 1708,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/108486333503400390558\">Rishabh Ranjan Singh</a>"
                ],
                "photo_reference": "AZose0lhHr83qP7Q6XjXVzcXsUf-trjLQFrc6dY6_i9AKBpnNSDy9le-AHjBx7fdHd3cqK5ff4rWWip8eUMb73i0g2kXlmfKOcEEKP5L-wLveWeNNJrxKlxzDbTAZyIGprxOMeBOTrxHNZ8MuoFLqLRD6O6m4gKYCjtktYOpdL_jx-V_4zsU",
                "width": 2560
            },
            {
                "height": 2448,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/100465116672089033311\">Ahmet Sevilmis</a>"
                ],
                "photo_reference": "AZose0krA5nhITZPHueP-RlDBCdjMXZfcJL2Ncs7vPTqM8iY-Lq6JxfvuyaUT6XyISMa-NfIvK6M7yE9lVSCtzjHH3BRnWnPBrhk3tYK6-3qmyPXPTZm4EmmJDQ0aZgdGZgCrhJUCFezYThcRhvwY-I7Zjj339J7uoGqrsr-nIiT-bHWOHxr",
                "width": 3264
            },
            {
                "height": 3024,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/114548666168700422720\">Joanna A</a>"
                ],
                "photo_reference": "AZose0mqSAdUeb205HpX_JZamYtcPk6d977VnUT8zp6E4t40VqsXVKnRnzfzofsaag5MGYj-zOTAJZ3ynzfas72M71bDnVRMaFRbIueED3KNP7O1KICbyAf6wQeNaBQqV19ZQ8f1rWJwSjmu5sV1DpCbc5oqKdTtt0qwVd-2uMJd-5v5YTMA",
                "width": 4032
            },
            {
                "height": 3024,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/104484767598978428761\">Kathi Bleimuth</a>"
                ],
                "photo_reference": "AZose0krEvRMJm3jZdG072vPVOZaVsGu1OKumYj4jJ0niHj2HHdkFkNzMlEiKXthrjqSAn18Mgu4pSSdgHCV0dohxViI8H-RsvUGYdtZKB8qiyd58EZx850rrCyuLAtsgBUFJ6BaU5qO6PNuw6pSshi3dg5kq0d1-CQN_p3DsKOKPBVBqMTN",
                "width": 4032
            },
            {
                "height": 3472,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/107015093402067262693\">Saliha Karaoglu</a>"
                ],
                "photo_reference": "AZose0nZFNlkz5cvA1_5o1SR4-4cxj2EuJJB9OG63XRS7iByru14wSOnBKxkYNApE-VDojnMqaz8HHxu3IorSqmdRY7BbHy1JN18pfTaMuMg0ikcMZukgOeAmB2O6hd4WN4tPMp70ZMrE5_ItQBTkzkg-y643QVnalGNof_SSDvcIBm8sgUB",
                "width": 3472
            },
            {
                "height": 3024,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/114548666168700422720\">Joanna A</a>"
                ],
                "photo_reference": "AZose0lz4I5TjzwKACDG3zfhcRJ2zKSUPcz9ksogkLwnrI4Ii_IVcS4LIcXewFVfXzjZXZKWtrkIpMJnfdAIsSkEhS06cmoFQ9qzYeokCBfKtOoUI3OcG5Bk78V1KX1UzlrzHTiIRH8IWJf6U3wbansiAnh8dyrYNg16pV1UFZLXK_csZ8t5",
                "width": 4032
            },
            {
                "height": 1469,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/100411041529869983421\">Ana Feraru</a>"
                ],
                "photo_reference": "AZose0m5ZcIeP0FjJSAeDpm2PXcaeAMWZfv-k-gMEcefdyF-rH9kHsKZhe-ubAgz51UVS90_un35x2dmjugtUcZLvZDdY-G5zaQ4CT7JLlDW2RvfMVBoGZViomEsSUU6pPTtAdU3kLuiP-1gvuSgAryj1i7q-fi7nPPzO-ZvjQYfRxt9bnsA",
                "width": 2000
            },
            {
                "height": 2268,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/101114372591583638606\">Juliano Costa</a>"
                ],
                "photo_reference": "AZose0ks93O7OMzIQ8ggrgmmQlLvoVD5OwyHQnvC9IJ4I1iYqyqNAOcl9fqkTtULELb7qux3Ek3Px-XZk0SgF3mcwSoI62YNaOgGXOS6TA3hp9y-hiGKf50QBKArBa7ogmFWHHsN9ianDuEod5XjLqe86ph3wH0fdleg2fg0wW550EyPl560",
                "width": 4032
            }
        ],
        "place_id": "ChIJtV5bzSAFdkgRpwLZFPWrJgo",
        "plus_code": {
            "compound_code": "GV25+G6 London, UK",
            "global_code": "9C3XGV25+G6"
        },
        "rating": 4.5,
        "reference": "ChIJtV5bzSAFdkgRpwLZFPWrJgo",
        "reviews": [
            {
                "author_name": "CGe0",
                "author_url": "https://www.google.com/maps/contrib/109501611748464632312/reviews",
                "language": "en",
                "original_language": "en",
                "profile_photo_url": "https://lh3.googleusercontent.com/a-/AD_cMMTxT7eq0kiRfJXyj8wbC251xH1tL706v3kysjHd=s128-c0x00000000-cc-rp-mo-ba6",
                "rating": 5,
                "relative_time_description": "a year ago",
                "text": "I loved it.\nIt was quite great to see this famous palace.\nIt became much more beautiful as the sun set and the palace lights started lighting up the palace and it's surroundings.\nIt was not as crowded as other parts of London today.\nDefinitely worth visiting.",
                "time": 1645914535,
                "translated": false
            },
            {
                "author_name": "Ahmed Abbas",
                "author_url": "https://www.google.com/maps/contrib/112260530733835047098/reviews",
                "language": "en",
                "original_language": "en",
                "profile_photo_url": "https://lh3.googleusercontent.com/a-/AD_cMMQnrx0ONUoLz3PtDNDIh6vCTIMtYLeV0ypXyxh4qnM=s128-c0x00000000-cc-rp-mo-ba5",
                "rating": 5,
                "relative_time_description": "8 months ago",
                "text": "Buckingham Palace is truly one of the most popular tourist destinations in London, and obviously for a very good reason. It's the official residence of the British monarchy (the queen), and it's absolutely massive and beautify built. I was really impressed with how well-kept everything was and how organized everything is. The gardens are so beautiful, and there's so much history inside and outside the palace. The Changing of the Guard ceremony was so beautiful and thousands of people were outside watching the ceremony. I would definitely recommend a visit if you're in London, it's a must see.",
                "time": 1662331637,
                "translated": false
            },
            {
                "author_name": "Jesse Lau",
                "author_url": "https://www.google.com/maps/contrib/102071653030898286880/reviews",
                "language": "en",
                "original_language": "en",
                "profile_photo_url": "https://lh3.googleusercontent.com/a-/AD_cMMTnpl_S3Hw4BabZFGEvi3ohm2GQkujIoxkoWo4US4E=s128-c0x00000000-cc-rp-mo-ba5",
                "rating": 5,
                "relative_time_description": "9 months ago",
                "text": "I have been to here just to enjoy the changing of guards in different views, it is amazing!\nAnd I have visit the State Rooms, Royal Mews and the Queen’s gallery. There are so much collections that you could enjoy.\nA very unique experience, would love to bring my wife here again.\nP.S.  if you want to see the changing of guards with a better view, you could either choose under the Queen Victoria statue or beside the gate of the Palace. The guards will enter the gate from both sides, and leave  the Palace using the middle gate. Good luck! Enjoy!",
                "time": 1659913249,
                "translated": false
            },
            {
                "author_name": "Akhilsai Meesala",
                "author_url": "https://www.google.com/maps/contrib/107201999586842687521/reviews",
                "language": "en",
                "original_language": "en",
                "profile_photo_url": "https://lh3.googleusercontent.com/a-/AD_cMMRGNyVV6VrFa1_EhC7oCqE-nlqwn3tkslkEA8BdsP4=s128-c0x00000000-cc-rp-mo-ba3",
                "rating": 5,
                "relative_time_description": "a year ago",
                "text": "As per say ...it is The Queens stay and it's quite well fortified. Beautiful architecture.... Which is ancient and has a lot of history too....so over all it's a cool and fully secured place and the fountain is really awesome with the sky as it's background❤️",
                "time": 1644678922,
                "translated": false
            },
            {
                "author_name": "Gary Smith",
                "author_url": "https://www.google.com/maps/contrib/101953923515913863311/reviews",
                "language": "en",
                "original_language": "en",
                "profile_photo_url": "https://lh3.googleusercontent.com/a-/AD_cMMSAV-b5GwqD2q_xM1D5TC2mvqVpqekk26nWGWOszw=s128-c0x00000000-cc-rp-mo-ba5",
                "rating": 5,
                "relative_time_description": "9 months ago",
                "text": "Go see Liz. The state room tour is very sumptuous and to see a little of the behind the scenes was good. The audio guides were informative and detailed but a little short.\nAfter the tour we are in the garden cafe, a good choice of food but really expensive. The garden tour was good but we got the feeling the guide was not feeling it that afternoon. Will go back and do the other tours at a later date.",
                "time": 1659689625,
                "translated": false
            }
        ],
        "types": [
            "tourist_attraction",
            "point_of_interest",
            "establishment"
        ],
        "url": "https://maps.google.com/?cid=731461058599387815",
        "user_ratings_total": 149043,
        "utc_offset": 60,
        "vicinity": "London",
        "website": "https://www.royalcollection.org.uk/visit/the-state-rooms-buckingham-palace",
        "wheelchair_accessible_entrance": true
    }
```
