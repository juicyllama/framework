type Constructor<T = {}> = new (...args: any[]) => T

/**
 * A utility class for working with classes.
 */
export class Classes {
	/*
	 * Allow classes to extend multiple classes. Returns a constructor with a mixed type of all base classes.
	 * The constructor calls the constructors of all base classes and assigns their properties to the mixed class.
	 * Each base class can have its own set of constructor arguments.
	 * Example: `const MixedClass = Classes.ExtendsMultiple(ClassA, ClassB); const mixedInstance = new MixedClass(['Test'], [30])`
	 * In this example, `mixedInstance` will have properties and methods from both `ClassA` and `ClassB`.
	 * ClassA's constructor will be called with `['Test']` and ClassB's constructor with `[30]`.
	 *
	 * @param baseClasses The base classes to extend.
	 */
	static ExtendsMultiple<TBase extends Constructor[]>(
		baseClasses: TBase,
	): new (...args: any[]) => UnionToIntersection<InstanceType<TBase[number]>> {
		class BaseClass extends (baseClasses[0] || class {}) {
			constructor(...args: any[]) {
				super(...args[0]) // Assuming the first set of args is for the base class
				// Call constructors of all mixins
				baseClasses.slice(1).forEach((Base, index) => {
					Object.assign(this, new Base(...args[index + 1]))
				})
			}
		}

		// Apply mixins
		baseClasses.slice(1).forEach(baseClass => {
			Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
				const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name)
				if (descriptor) {
					Object.defineProperty(BaseClass.prototype, name, descriptor)
				}
			})
		})

		return BaseClass as any
	}
}

// Helper type for converting a union of types to an intersection
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
