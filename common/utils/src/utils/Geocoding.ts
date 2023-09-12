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
		//given the bounding box is an imaginary rectangle in a coordinate system
		//bounding box has 4 sides - northLine, eastLine, southLine and westLine
		//initially assume the coordinates is not in our bounding box of interest as such:
		let iscoordinatesEastOfWestLine = false
		let iscoordinatesWestOfEastLine = false
		let iscoordinatesSouthOfNorthLine = false
		let iscoordinatesNorthOfSouthLine = false

		if (boundingBox.east < boundingBox.west) {
			//if west coordinate has a bigger value than the east,
			//the bounding box must be crossing the dateline
			//in other words, longitude 180 is inside the box
			//let's see what's happening with the coordinates
			if (coordinates.longitude >= boundingBox.west) {
				//imagine a bounding box where westernmost longitude is +170 and easternmost longitude is -170
				//if the coordinates in question has a latitude of +171 as in the case expressed in the if
				//statement, then we can conclude that coordinates lies east of the west line
				iscoordinatesEastOfWestLine = true

				//we can also infer that the coordinates must lie west of east line because the coordinates's longitude is positive
				//therefore, the coordinates's position must be to the west of the easternmost longitude of the bounding box
				iscoordinatesWestOfEastLine = true
			}

			if (coordinates.longitude <= boundingBox.east) {
				//imagine a bounding box where westernmost longitude is +170 and easternmost longitude is -170
				//if the coordinates in question has a latitude of -171 as in the case expressed in the if
				//statement, then we can conclude that coordinates lies west of the east line
				iscoordinatesWestOfEastLine = true

				//we can also infer that the coordinates must lie east of the west line because the coordinates's longitude is negative
				//therefore, the coordinates's position must be to the east of the westernmost longitude of the bounding box
				iscoordinatesEastOfWestLine = true
			}
		} else {
			//in the else case, bounding box does not cross the dateline, so comparisons are more straightforward
			//longitudes range from -180 to +180; therefore, western side of a bounding box will always
			//have lower value than eastern side
			if (coordinates.longitude >= boundingBox.west) {
				//in this case, coordinates's longitude has a higher value than the west side of the bounding box
				//we can conclude that coordinates lies to the east of the west line of the bounding box
				iscoordinatesEastOfWestLine = true
			}
			if (coordinates.longitude <= boundingBox.east) {
				//in this case, coordinates's longitude has a lower value than the east side of the bounding box
				//we can conclude that coordinates lies to the east of the west line of the bounding box
				iscoordinatesWestOfEastLine = true
			}
		}

		//comparing latitudes are little bit easier. latitude values range from -90 to +90 where
		//-90 is the southern pole and +90 is the northern pole. The more north you go, higher the values.
		if (coordinates.latitude >= boundingBox.south) {
			//coordinates's latitude is higher, therefore, coordinates must lie to the north of the south line
			iscoordinatesNorthOfSouthLine = true
		}

		if (coordinates.latitude <= boundingBox.north) {
			//coordinates's latitude is higher, therefore, coordinates must lie to the north of the south line
			iscoordinatesSouthOfNorthLine = true
		}

		return (
			iscoordinatesEastOfWestLine &&
			iscoordinatesWestOfEastLine &&
			iscoordinatesNorthOfSouthLine &&
			iscoordinatesSouthOfNorthLine
		)
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
		const EARTH = 6378.137 //radius of the earth in kilometers

		if (!southwest?.longitude || !southwest?.latitude || !northeast?.longitude || !northeast?.latitude) {
			return false
		}

		if (expand_by_meters) {
			const pi = Math.PI
			const m = 1 / (((2 * pi) / 360) * EARTH) / 1000 //1 meter in degree
			const cos = Math.cos

			northeast.latitude = Number(northeast.latitude) + Number(Number(expand_by_meters) * m)
			southwest.latitude = Number(southwest.latitude) - Number(Number(expand_by_meters) * m)

			northeast.longitude =
				Number(northeast.longitude) +
				Number(Number(expand_by_meters) * Number(m)) / cos(Number(northeast.longitude) * (pi / 180))
			southwest.longitude =
				Number(southwest.longitude) -
				Number(Number(expand_by_meters) * Number(m)) / cos(Number(southwest.longitude) * (pi / 180))
		}

		if (
			Number(coordinates.latitude) < Number(northeast.latitude) &&
			Number(coordinates.longitude) < Number(northeast.longitude) &&
			Number(coordinates.latitude) > Number(southwest.latitude) &&
			Number(coordinates.longitude) > Number(southwest.longitude)
		) {
			//console.debug(`latitude ${coordinates.latitude} is inside the latitude bounds of > ${southwest.latitude} and < ${northeast.latitude}`)
			//console.debug(`longitude ${coordinates.longitude} is inside the longitude bounds of  > ${southwest.longitude} and < ${northeast.longitude}`)
			return true
		}

		//console.debug(`latitude ${coordinates.latitude} is outside the latitude bounds of > ${southwest.latitude} and < ${northeast.latitude}`)
		//console.debug(`longitude ${coordinates.longitude} is outside the longitude bounds of < ${northeast.longitude} and > ${southwest.longitude}`)
		return false

		// const dx = southwest.longitude - northeast.longitude
		// const dy = southwest.latitude - northeast.latitude
		// const innerProduct =
		// 	(coordinates.longitude - northeast.longitude) * dx + (coordinates.latitude - northeast.latitude) * dy
		// return 0 <= innerProduct && innerProduct <= dx * dx + dy * dy
	}

	//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
	static distanceBetweenTwoPoints(pointA: Coordinates, pointB: Coordinates): number {
		const R = 6371 // km
		const dLat = this.toRad(pointB.latitude - pointA.latitude)
		const dLon = this.toRad(pointB.longitude - pointA.longitude)
		const lat1 = this.toRad(pointA.latitude)
		const lat2 = this.toRad(pointB.latitude)

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		const d = R * c
		return d
	}

	// Converts numeric degrees to radians
	static toRad(Value): number {
		return (Value * Math.PI) / 180
	}
}
