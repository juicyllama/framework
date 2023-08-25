export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface BoundingBox {
    north: number;
    east: number;
    south: number;
    west: number;
}
export declare class Geocoding {
    static areCoordinatesInBoundingBox(coordinates: Coordinates, boundingBox: BoundingBox): boolean;
    static areCoordinatesBetweenTwoPoints(coordinates: Coordinates, northeast: Coordinates, southwest: Coordinates, expand_by_meters?: number): boolean;
    static distanceBetweenTwoPoints(pointA: Coordinates, pointB: Coordinates): number;
    static toRad(Value: any): number;
}
