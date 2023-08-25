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

	it('Airport should not find find with 1k buffer', async () => {
		const location: Coordinates = { latitude: 52.310284, longitude: 4.753804 }
		const northeast: Coordinates = { latitude: 52.311888, longitude: 4.769623 } //AMS
		const southwest: Coordinates = { latitude: 52.30919, longitude: 4.766925 } //AMS
		expect(Geocoding.areCoordinatesBetweenTwoPoints(location, northeast, southwest, 1000)).toBeFalsy()
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
})
