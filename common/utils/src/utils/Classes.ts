export class Classes {

	/*
	* Allow classes to extend multiple classes
	*/

	static ExtendsMultiple(classes: any[]): any {
		return classes.reduce((baseClass, cls) => {
			return class extends baseClass {
				constructor(...args: any[]) {
					super(...args);
					Object.assign(this, new cls(...args));
				}
			};
		});
	}
}
