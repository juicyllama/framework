import { Classes } from './Classes'

// Example parent classes remain unchanged...

// Example parent classes
class ClassA {
	name: string

	constructor(name: string) {
		this.name = name
	}

	greet(): string {
		return `Hello from ClassA, ${this.name}`
	}
}

class ClassB {
	age: number

	constructor(age: number) {
		this.age = age
	}

	celebrate(): string {
		return `Celebrating ${this.age} years`
	}
}

class ClassC {
	greeting: string

	constructor(greeting: string) {
		this.greeting = greeting
	}

	greet(): string {
		return `ClassC says: ${this.greeting}`
	}
}

class ClassD {
	message: string

	constructor(message: string) {
		this.message = message
	}

	getMessage(): string {
		return this.message
	}

	delayedGreet(): Promise<string> {
		return new Promise(resolve => {
			setTimeout(() => resolve(`Delayed Greet: ${this.getMessage()}`), 50)
		})
	}
}

class ClassE {
	value: number

	constructor(value: number) {
		this.value = value
	}

	double(): number {
		return this.value * 2
	}
}
describe('Classes', () => {
	describe('ExtendsMultiple', () => {
		it('should inherit properties and methods from all parent classes', () => {
			const MixedClass = Classes.ExtendsMultiple([ClassA, ClassB])
			const mixedInstance = new MixedClass(['Test'], [30]) // Adjusted for wrapping arrays

			expect(mixedInstance.greet()).toBe('Hello from ClassA, Test')
			expect(mixedInstance.celebrate()).toBe('Celebrating 30 years')
		})

		it('should call constructors of all parent classes', () => {
			const MixedClass = Classes.ExtendsMultiple([ClassA, ClassB])
			const mixedInstance = new MixedClass(['Test'], [30]) // Adjusted for wrapping arrays

			expect(mixedInstance.name).toBe('Test')
			expect(mixedInstance.age).toBe(30)
		})

		it('should handle instanceof checks correctly for the most derived and base classes', () => {
			const MixedClass = Classes.ExtendsMultiple([ClassA, ClassB])
			const mixedInstance = new MixedClass(['Test'], [30]) // Adjusted for wrapping arrays

			expect(mixedInstance instanceof MixedClass).toBe(true)
		})

		it('should properly handle methods with the same name', () => {
			const MixedClass = Classes.ExtendsMultiple([ClassA, ClassC])
			const mixedInstance = new MixedClass(['Test'], ['Hello']) // Adjusted for wrapping arrays

			expect(mixedInstance.greet()).toBe('ClassC says: Hello')
		})

		it('should ensure proper binding of methods', async () => {
			const MixedClass = Classes.ExtendsMultiple([ClassA, ClassD])
			const mixedInstance = new MixedClass(['Test'], ['Async Hello']) // Adjusted for wrapping arrays

			await expect(mixedInstance.delayedGreet()).resolves.toBe('Delayed Greet: Async Hello')
		})

		it('should integrate seamlessly with other functionalities', () => {
			const MixedClass = Classes.ExtendsMultiple([ClassA, ClassE])
			const mixedInstance = new MixedClass(['Test'], [15]) // Adjusted for wrapping arrays

			expect(mixedInstance.double()).toBe(30)
		})

		it('should maintain distinct instances without shared state', () => {
			const MixedClass = Classes.ExtendsMultiple([ClassA, ClassB])
			const instance1 = new MixedClass(['Instance1'], [10]) // Adjusted for wrapping arrays
			const instance2 = new MixedClass(['Instance2'], [20]) // Adjusted for wrapping arrays

			instance1.name = 'ChangedName1'
			instance2.age = 25

			expect(instance1.name).not.toBe(instance2.name)
			expect(instance1.age).not.toBe(instance2.age)
		})
	})
})
