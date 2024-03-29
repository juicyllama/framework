/**
 * @jest-environment jsdom
 */

import { Coordinates, BoundingBox, Geocoding } from './Geocoding'

describe('areCoordinatesInBoundingBox', () => {
	it('Check if London is in UK', async () => {
		const location: Coordinates = { latitude: 51.5072, longitude: 0.1276 } //london
		const boundingBox: BoundingBox = { north: 59.144688, east: 3.147154, south: 50.194155, west: -11.398745 } //UK
		expect(Geocoding.areCoordinatesInBoundingBox(location, boundingBox)).toBeTruthy()
	})

	it('Check if New York is in UK', async () => {
		const location: Coordinates = { latitude: 40.7128, longitude: 74.006 } //New york
		const boundingBox: BoundingBox = { north: 59.144688, east: 3.147154, south: 50.194155, west: -11.398745 } //UK
		expect(Geocoding.areCoordinatesInBoundingBox(location, boundingBox)).toBeFalsy()
	})

	it('Check if Berlin is in Germany', async () => {
		const location: Coordinates = { latitude: 52.52, longitude: 13.405 } // Berlin
		const boundingBox: BoundingBox = { north: 55.058347, east: 15.041896, south: 47.270123, west: 5.866315 } // Germany
		expect(Geocoding.areCoordinatesInBoundingBox(location, boundingBox)).toBeTruthy()
	})

	it('Check if Rome is in Italy', async () => {
		const location: Coordinates = { latitude: 41.9028, longitude: 12.4964 } // Rome
		const boundingBox: BoundingBox = { north: 47.092, east: 18.7996, south: 35.5122, west: 6.6273 } // Italy
		expect(Geocoding.areCoordinatesInBoundingBox(location, boundingBox)).toBeTruthy()
	})

	it('Check if Sydney is in Australia', async () => {
		const location: Coordinates = { latitude: -33.8688, longitude: 151.2093 } // Sydney
		const boundingBox: BoundingBox = { north: -9.2211, east: 153.6395, south: -44.1185, west: 112.9511 } // Australia
		expect(Geocoding.areCoordinatesInBoundingBox(location, boundingBox)).toBeTruthy()
	})

	it('Check if Moscow is in the US', async () => {
		const location: Coordinates = { latitude: 55.7558, longitude: 37.6173 } // Moscow
		const boundingBox: BoundingBox = { north: 49.384358, east: -66.93457, south: 24.396308, west: -125.00165 } // US
		expect(Geocoding.areCoordinatesInBoundingBox(location, boundingBox)).toBeFalsy()
	})

	it('Check if Cairo is in Egypt', async () => {
		const location: Coordinates = { latitude: 30.8025, longitude: 31.1695 } // Cairo
		const boundingBox: BoundingBox = { north: 31.9165, east: 35.7937, south: 21.7371, west: 25.0 } // Egypt
		expect(Geocoding.areCoordinatesInBoundingBox(location, boundingBox)).toBeTruthy()
	})
})

describe('areCoordinatesBetweenTwoPoints', () => {
	it('Check if London is in UK', async () => {
		const location: Coordinates = { latitude: 51.5072, longitude: -0.12182 } //london
		const northeast: Coordinates = { latitude: 54.037581, longitude: 1.628983 } //UK
		const southwest: Coordinates = { latitude: 49.858231, longitude: -5.076589 } //UK
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest)).toBeTruthy()
	})

	it('Check that New York is not in UK', async () => {
		const location: Coordinates = { latitude: 40.7128, longitude: 74.006 } //New york
		const northeast: Coordinates = { latitude: 58.565119, longitude: -11.397972 } //UK
		const southwest: Coordinates = { latitude: 49.88128, longitude: 3.666387 } //UK
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest)).toBeFalsy()
	})

	it('Check if point at PMI is not at KLQ with buffer', async () => {
		const location: Coordinates = { latitude: 39.543, longitude: 2.727 } //PMI
		const northeast: Coordinates = { latitude: 5.656636, longitude: 106.096839 } //KLQ
		const southwest: Coordinates = { latitude: -5.943322, longitude: 95.193437 } //KLQ
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 1000)).toBeFalsy()
	})

	it('Check if point at PMI is at PMI with no buffer (middle)', async () => {
		const location: Coordinates = { latitude: 39.5566427, longitude: 2.7179836 } //PMI
		const northeast: Coordinates = { latitude: 39.570281, longitude: 2.760383 } //PMI
		const southwest: Coordinates = { latitude: 39.531673, longitude: 2.711746 } //PMI
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest)).toBeTruthy()
	})

	it('Check if point at PMI is at PMI with buffer (north east)', async () => {
		const location: Coordinates = { latitude: 39.561609, longitude: 2.70687 } //PMI
		const northeast: Coordinates = { latitude: 39.551741, longitude: 2.736165 } //PMI
		const southwest: Coordinates = { latitude: 39.54417, longitude: 2.72629 } //PMI
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 5000)).toBeTruthy()
	})

	it('Check if point at PMI is at PMI with buffer (north west)', async () => {
		const location: Coordinates = { latitude: 39.559395, longitude: 2.765876 } //PMI
		const northeast: Coordinates = { latitude: 39.551741, longitude: 2.736165 } //PMI
		const southwest: Coordinates = { latitude: 39.54417, longitude: 2.72629 } //PMI
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 5000)).toBeTruthy()
	})

	it('Check if point at PMI is at PMI with buffer (south west)', async () => {
		const location: Coordinates = { latitude: 39.539468, longitude: 2.729009 } //PMI
		const northeast: Coordinates = { latitude: 39.551741, longitude: 2.736165 } //PMI
		const southwest: Coordinates = { latitude: 39.54417, longitude: 2.72629 } //PMI
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 5000)).toBeTruthy()
	})

	it('Check if point at PMI is at PMI with buffer (south east)', async () => {
		const location: Coordinates = { latitude: 39.545254, longitude: 2.707889 } //PMI
		const northeast: Coordinates = { latitude: 39.551741, longitude: 2.736165 } //PMI
		const southwest: Coordinates = { latitude: 39.54417, longitude: 2.72629 } //PMI
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 5000)).toBeTruthy()
	})

	it('Check if point at PMI is at PMI with buffer (south east)', async () => {
		const location: Coordinates = { latitude: 39.544, longitude: 2.733 } //PMI
		const northeast: Coordinates = { latitude: 39.551741, longitude: 2.736165 } //PMI
		const southwest: Coordinates = { latitude: 39.54417, longitude: 2.72629 } //PMI
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 5000)).toBeTruthy()
	})

	it('Airport should not find with 0k buffer', async () => {
		const location: Coordinates = { latitude: 52.310284, longitude: 4.753804 }
		const northeast: Coordinates = { latitude: 52.311888, longitude: 4.769623 } //AMS
		const southwest: Coordinates = { latitude: 52.30919, longitude: 4.766925 } //AMS
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest)).toBeFalsy()
	})

	it('Airport should not find with 0.5k buffer', async () => {
		const location: Coordinates = { latitude: 52.310284, longitude: 4.753804 }
		const northeast: Coordinates = { latitude: 52.311888, longitude: 4.769623 } //AMS
		const southwest: Coordinates = { latitude: 52.30919, longitude: 4.766925 } //AMS
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 500)).toBeFalsy()
	})

	it('Airport find with 5k buffer', async () => {
		const location: Coordinates = { latitude: 52.310284, longitude: 4.753804 }
		const northeast: Coordinates = { latitude: 52.311888, longitude: 4.769623 } //AMS
		const southwest: Coordinates = { latitude: 52.30919, longitude: 4.766925 } //AMS
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 5000)).toBeTruthy()
	})

	it('Airport find with 10k buffer', async () => {
		const location: Coordinates = { latitude: 52.310284, longitude: 4.753804 }
		const northeast: Coordinates = { latitude: 52.311888, longitude: 4.769623 } //AMS
		const southwest: Coordinates = { latitude: 52.30919, longitude: 4.766925 } //AMS
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 10000)).toBeTruthy()
	})

	it('Should not find anything here...', async () => {
		const location: Coordinates = { latitude: 35.59, longitude: 111.31 }
		const northeast: Coordinates = { latitude: 42.46404, longitude: 109.67322 }
		const southwest: Coordinates = { latitude: 41.13107, longitude: 107.26225 }
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest)).toBeFalsy()
	})

	it('Should not find anything here...', async () => {
		const location: Coordinates = { latitude: 35.59, longitude: 111.31 }
		const northeast: Coordinates = { latitude: 42.46404, longitude: 109.67322 }
		const southwest: Coordinates = { latitude: 41.13107, longitude: 107.26225 }
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest)).toBeFalsy()
	})

	it('Check that MMY airpot is not inside IRD airport with 75km buffer ', async () => {
		const location: Coordinates = { latitude: 24.789, longitude: 125.301 } //MMY
		const northeast: Coordinates = { latitude: 24.155412, longitude: 89.048824 } //IRD
		const southwest: Coordinates = { latitude: 24.152714, longitude: 89.04582 } //IRD
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 75000)).toBeFalsy()
	})

	it('Check that HTG airpot is not inside YSY airport with 75km buffer ', async () => {
		const location: Coordinates = { latitude: 71.977295, longitude: 102.486549 } //HTG
		const northeast: Coordinates = { latitude: 71.993075, longitude: -125.242175 } //YSY
		const southwest: Coordinates = { latitude: 71.993079, longitude: -125.242185 } //YSY
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 75000)).toBeFalsy()
	})

	it('Truthy buffer test 1: Check that point is inside bounding box with 50km buffer', async () => {
		const location: Coordinates = { latitude: 34.428, longitude: -118.561 } // Near Los Angeles, USA
		const northeast: Coordinates = { latitude: 34.0611, longitude: -118.2452 } // Downtown Los Angeles, USA
		const southwest: Coordinates = { latitude: 34.0593, longitude: -118.2481 } // Downtown Los Angeles, USA
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 50000)).toBeTruthy()
	})

	it('Truthy buffer test 2: Check that point is inside bounding box with 25km buffer', async () => {
		const location: Coordinates = { latitude: 48.866, longitude: 2.355 } // Near central Paris, France
		const northeast: Coordinates = { latitude: 48.8584, longitude: 2.2945 } // Eiffel Tower, Paris, France
		const southwest: Coordinates = { latitude: 48.8576, longitude: 2.2974 } // Eiffel Tower, Paris, France
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 25000)).toBeTruthy()
	})

	it('Truthy buffer test 3: Check that point is inside bounding box with 10km buffer', async () => {
		const location: Coordinates = { latitude: 51.501, longitude: -0.142 } // Near Buckingham Palace, London, UK
		const northeast: Coordinates = { latitude: 51.5074, longitude: -0.1278 } // Trafalgar Square, London, UK
		const southwest: Coordinates = { latitude: 51.5066, longitude: -0.1307 } // Trafalgar Square, London, UK
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 10000)).toBeTruthy()
	})

	it('Truthy buffer test 4: Check that point is inside bounding box with 30km buffer', async () => {
		const location: Coordinates = { latitude: -33.868, longitude: 151.209 } // Near Sydney Opera House, Australia
		const northeast: Coordinates = { latitude: -33.8568, longitude: 151.2153 } // Sydney Opera House, Australia
		const southwest: Coordinates = { latitude: -33.858, longitude: 151.2182 } // Sydney Opera House, Australia
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 30000)).toBeTruthy()
	})

	it('Truthy buffer test 5: Check that point is inside bounding box with 5km buffer', async () => {
		const location: Coordinates = { latitude: 35.689, longitude: 139.692 } // Near Tokyo Tower, Japan
		const northeast: Coordinates = { latitude: 35.6596, longitude: 139.7414 } // Tokyo Tower, Japan (Adjusted)
		const southwest: Coordinates = { latitude: 35.6576, longitude: 139.7443 } // Tokyo Tower, Japan (Adjusted)
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 5000)).toBeTruthy()
	})

	it('Truthy buffer test 6: Check that point is just inside bounding box with 1km buffer', async () => {
		const location: Coordinates = { latitude: 52.3695, longitude: 4.8917 } // Close to Amsterdam, Netherlands
		const northeast: Coordinates = { latitude: 52.3689, longitude: 4.8912 }
		const southwest: Coordinates = { latitude: 52.3688, longitude: 4.8911 }
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 1000)).toBeTruthy()
	})

	it('Truthy buffer test 7: Check that point is just inside bounding box with 500m buffer', async () => {
		const location: Coordinates = { latitude: 40.7115, longitude: -74.0125 } // Close to New York City, USA
		const northeast: Coordinates = { latitude: 40.7111, longitude: -74.012 }
		const southwest: Coordinates = { latitude: 40.711, longitude: -74.0121 }
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 500)).toBeTruthy()
	})

	it('Falsey buffer test 1: Check that point is outside bounding box even with 50km buffer', async () => {
		const location: Coordinates = { latitude: 34.685087, longitude: 135.805 } // Osaka, Japan
		const northeast: Coordinates = { latitude: 35.6895, longitude: 139.6917 } // Tokyo, Japan
		const southwest: Coordinates = { latitude: 35.6894, longitude: 139.6916 } // Tokyo, Japan
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 50000)).toBeFalsy()
	})

	it('Falsey buffer test 2: Check that point is outside bounding box even with 25km buffer', async () => {
		const location: Coordinates = { latitude: 40.73061, longitude: -73.935242 } // New York City, USA
		const northeast: Coordinates = { latitude: 38.9041, longitude: -77.0171 } // Washington D.C., USA
		const southwest: Coordinates = { latitude: 38.904, longitude: -77.0172 } // Washington D.C., USA
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 25000)).toBeFalsy()
	})

	it('Falsey buffer test 3: Check that point is outside bounding box even with 10km buffer', async () => {
		const location: Coordinates = { latitude: 48.8566, longitude: 2.3522 } // Paris, France
		const northeast: Coordinates = { latitude: 51.5074, longitude: -0.1278 } // London, UK
		const southwest: Coordinates = { latitude: 51.5073, longitude: -0.1279 } // London, UK
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 10000)).toBeFalsy()
	})

	it('Falsey buffer test 4: Check that point is outside bounding box even with 100km buffer', async () => {
		const location: Coordinates = { latitude: -33.8688, longitude: 151.2093 } // Sydney, Australia
		const northeast: Coordinates = { latitude: -37.8136, longitude: 144.9631 } // Melbourne, Australia
		const southwest: Coordinates = { latitude: -37.8137, longitude: 144.9632 } // Melbourne, Australia
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 100000)).toBeFalsy()
	})

	it('Falsey buffer test 5: Check that point is outside bounding box even with 75km buffer', async () => {
		const location: Coordinates = { latitude: 19.076, longitude: 72.8777 } // Mumbai, India
		const northeast: Coordinates = { latitude: 28.6139, longitude: 77.209 } // Delhi, India
		const southwest: Coordinates = { latitude: 28.6138, longitude: 77.2091 } // Delhi, India
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 75000)).toBeFalsy()
	})

	it('Falsey buffer test 6: Check that point is outside bounding box even with 1km buffer', async () => {
		const location: Coordinates = { latitude: 48.8586, longitude: 2.3661 } // Further outside Paris, France
		const northeast: Coordinates = { latitude: 48.857, longitude: 2.3516 }
		const southwest: Coordinates = { latitude: 48.8569, longitude: 2.3517 }
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 1000)).toBeFalsy()
	})

	it('Falsey buffer test 7: Check that point is outside bounding box even with 200m buffer', async () => {
		const location: Coordinates = { latitude: 34.6863, longitude: 135.8069 } // Further outside Osaka, Japan
		const northeast: Coordinates = { latitude: 34.6849, longitude: 135.8044 }
		const southwest: Coordinates = { latitude: 34.6848, longitude: 135.8045 }
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 200)).toBeFalsy()
	})

	it('Falsey buffer test 8: Check that point is outside bounding box even with 100m buffer', async () => {
		const location: Coordinates = { latitude: -33.87, longitude: 151.2102 } // Further outside Sydney, Australia
		const northeast: Coordinates = { latitude: -33.8686, longitude: 151.209 }
		const southwest: Coordinates = { latitude: -33.8687, longitude: 151.2091 }
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 100)).toBeFalsy()
	})
})
