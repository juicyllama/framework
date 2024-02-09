import bboxPolygon from '@turf/bbox-polygon'
import { point, polygon } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
//@ts-ignore
import buffer from '@turf/buffer'
import bbox from '@turf/bbox'
import distance from '@turf/distance'

export interface Coordinates {
	latitude: number
	longitude: number
}

export interface BoundingBox {
	north: number
	east: number
	south: number
	west: number
}

export class Geocoding {
	static areCoordinatesInBoundingBox(coordinates: Coordinates, boundingBox: BoundingBox): boolean {
		// Define the bounding box polygon using the northeast and southwest coordinates
		const _bboxPolygon = bboxPolygon([boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north])

		// Convert the target coordinates to a turf point
		const pointToCheck = point([coordinates.longitude, coordinates.latitude])

		// Check if the point lies within the bounding box polygon
		const isPointInBbox = booleanPointInPolygon(pointToCheck, _bboxPolygon)

		return isPointInBbox
	}

	static areCoordinatesInPolygon(coordinates: Coordinates, polygonCords: Coordinates[]): boolean {
		const pointToCheck = point([coordinates.longitude, coordinates.latitude])
		const poly = polygon([polygonCords.map((p: Coordinates) => [p.longitude, p.latitude])])

		// Check if the point lies within the bounding box polygon
		const isPointInBbox = booleanPointInPolygon(pointToCheck, poly)

		return isPointInBbox
	}

	/**
	 * @function    areCoordinatesBetweenTwoPoints
	 * @description Determines if a point P = (p.x, p.y) lies on the line connecting points S = (S.x, S.y) and E = (E.x, E.y) by calculating the determinant of the matrix. A point is considered to belong to the line if the precision of the calculation is small enough (tests for errors and loss of precision).
	 * @param       {Coordinates} northeast   The start point
	 * @param       {Coordinates} southwest     The end point
	 * @param       {Coordinates} coordinates   The point we which to test.
	 * @param       {number}      expand_by_meters  To add a buffer of space around the points
	 *	@returns     <code>true</code> if the given point belongs to the line, <code>false</code> otherwise.
	 *	@see         {@link http://stackoverflow.com/a/907491/1337392|Distance Matrix Calculation}
	 */

	static areCoordinatesBetweenTwoPoints(
		coordinates: Coordinates,
		northeast: Coordinates,
		southwest: Coordinates,
		expand_by_meters?: number,
	): boolean {
		if (!southwest?.longitude || !southwest?.latitude || !northeast?.longitude || !northeast?.latitude) {
			return false
		}

		if (expand_by_meters) {
			const expandedBoundingBox = Geocoding.expandBoundingBox(northeast, southwest, expand_by_meters)
			northeast = expandedBoundingBox.northeast
			southwest = expandedBoundingBox.southwest
		}

		return Geocoding.areCoordinatesInBoundingBox(coordinates, {
			north: northeast.latitude,
			east: northeast.longitude,
			south: southwest.latitude,
			west: southwest.longitude,
		})
	}

	private static expandBoundingBox(
		northeast: Coordinates,
		southwest: Coordinates,
		meters: number,
	): { northeast: Coordinates; southwest: Coordinates } {
		const originalBbox = bboxPolygon([
			southwest.longitude,
			southwest.latitude,
			northeast.longitude,
			northeast.latitude,
		])

		// Buffer the bounding box
		const bufferedBbox = buffer(originalBbox, meters / 1000, { units: 'kilometers' }) // Convert meters to kilometers for buffer

		// Get the bounding box of the bufferedBbox to determine its extents
		const bufferedBboxExtent = bbox(bufferedBbox)

		// Extract the new northeast and southwest coordinates from the buffered bounding box
		const newNortheast: Coordinates = {
			latitude: bufferedBboxExtent[3], // North
			longitude: bufferedBboxExtent[2], // East
		}

		const newSouthwest: Coordinates = {
			latitude: bufferedBboxExtent[1], // South
			longitude: bufferedBboxExtent[0], // West
		}

		return { northeast: newNortheast, southwest: newSouthwest }
	}

	//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
	static distanceBetweenTwoPoints(pointA: Coordinates, pointB: Coordinates): number {
		// Convert your coordinates to turf Point format
		const turfPointA = point([pointA.longitude, pointA.latitude])
		const turfPointB = point([pointB.longitude, pointB.latitude])

		// Calculate distance using turf's distance function (this will be in kilometers by default)
		const _distance = distance(turfPointA, turfPointB)

		return _distance // Returns the distance in kilometers
	}
}
