"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Geocoding = void 0;
class Geocoding {
    static areCoordinatesInBoundingBox(coordinates, boundingBox) {
        let iscoordinatesEastOfWestLine = false;
        let iscoordinatesWestOfEastLine = false;
        let iscoordinatesSouthOfNorthLine = false;
        let iscoordinatesNorthOfSouthLine = false;
        if (boundingBox.east < boundingBox.west) {
            if (coordinates.longitude >= boundingBox.west) {
                iscoordinatesEastOfWestLine = true;
                iscoordinatesWestOfEastLine = true;
            }
            if (coordinates.longitude <= boundingBox.east) {
                iscoordinatesWestOfEastLine = true;
                iscoordinatesEastOfWestLine = true;
            }
        }
        else {
            if (coordinates.longitude >= boundingBox.west) {
                iscoordinatesEastOfWestLine = true;
            }
            if (coordinates.longitude <= boundingBox.east) {
                iscoordinatesWestOfEastLine = true;
            }
        }
        if (coordinates.latitude >= boundingBox.south) {
            iscoordinatesNorthOfSouthLine = true;
        }
        if (coordinates.latitude <= boundingBox.north) {
            iscoordinatesSouthOfNorthLine = true;
        }
        return (iscoordinatesEastOfWestLine &&
            iscoordinatesWestOfEastLine &&
            iscoordinatesNorthOfSouthLine &&
            iscoordinatesSouthOfNorthLine);
    }
    static areCoordinatesBetweenTwoPoints(coordinates, northeast, southwest, expand_by_meters) {
        const EARTH = 6378.137;
        if (!(southwest === null || southwest === void 0 ? void 0 : southwest.longitude) || !(southwest === null || southwest === void 0 ? void 0 : southwest.latitude) || !(northeast === null || northeast === void 0 ? void 0 : northeast.longitude) || !(northeast === null || northeast === void 0 ? void 0 : northeast.latitude)) {
            return false;
        }
        if (expand_by_meters) {
            const pi = Math.PI;
            const m = 1 / (((2 * pi) / 360) * EARTH) / 1000;
            const cos = Math.cos;
            northeast.latitude = Number(northeast.latitude) + Number(Number(expand_by_meters) * m);
            southwest.latitude = Number(southwest.latitude) - Number(Number(expand_by_meters) * m);
            northeast.longitude =
                Number(northeast.longitude) +
                    Number(Number(expand_by_meters) * Number(m)) / cos(Number(northeast.longitude) * (pi / 180));
            southwest.longitude =
                Number(southwest.longitude) -
                    Number(Number(expand_by_meters) * Number(m)) / cos(Number(southwest.longitude) * (pi / 180));
        }
        if (Number(coordinates.latitude) < Number(northeast.latitude) &&
            Number(coordinates.longitude) < Number(northeast.longitude) &&
            Number(coordinates.latitude) > Number(southwest.latitude) &&
            Number(coordinates.longitude) > Number(southwest.longitude)) {
            return true;
        }
        return false;
    }
    static distanceBetweenTwoPoints(pointA, pointB) {
        const R = 6371;
        const dLat = this.toRad(pointB.latitude - pointA.latitude);
        const dLon = this.toRad(pointB.longitude - pointA.longitude);
        const lat1 = this.toRad(pointA.latitude);
        const lat2 = this.toRad(pointB.latitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }
    static toRad(Value) {
        return (Value * Math.PI) / 180;
    }
}
exports.Geocoding = Geocoding;
