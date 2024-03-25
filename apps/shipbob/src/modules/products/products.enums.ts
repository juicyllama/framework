export enum ShipbobProductActiveStatus {
	Any, //Include both active and inactive
	Active, //Filter products that are Active
	Inactive, //Filter products that are Inactive
}

export enum ShipbobProductBundleStatus {
	Any, //Don't filter and consider products that are bundles or not bundles
	Bundle, //Filter by products that are bundles
	NotBundle, //Filter by products that are not bundles
}
