import { FormField } from '../types'
import { ValidationRule } from 'quasar'

const validateEmail = (email: string): boolean => {
	return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)
}

interface PasswordValidator {
	length: boolean
	capital: boolean
	number: boolean
	symbol: boolean
}

interface ValidationPassword {
	value: string
	confirm?: string
	valid?: PasswordValidator
	validated?: boolean
	hidden?: boolean
}

interface AuthFormState {
	name?: string
	stage?: number
	email?: string
	code?: string
	password?: ValidationPassword
}

function validatePassword(password: ValidationPassword): PasswordValidator {
	if (!password.value) {
		return {
			length: false,
			capital: false,
			number: false,
			symbol: false,
		}
	}

	return {
		// Test length
		length: password.value.length >= 8,
		// Test capital
		capital: /^(?=.*[A-Z]).*$/.test(password.value),
		// Test number
		number: /^(?=.*[0-9]).*$/.test(password?.value),
		// Test symbol
		symbol: /^(?=.*[!@#$%^&*()\-_+=]).*$/.test(password.value),
	}
}

function isPasswordValid(password: ValidationPassword): boolean {
	const result = validatePassword(password)
	return result.length && result.capital && result.number && result.symbol
}

function inputRequired(field: FormField): ValidationRule[] {
	return [val => (val && val.toString().length > 0) || `${field.label} must be filled in.`]
}

function inputEmailRequired(): ValidationRule[] {
	return [val => (val && val.length > 0 && validateEmail(val)) || 'Must be a valid email address.']
}

function inputEmailNotRequired(): ValidationRule[] {
	return [val => validateEmail(val) || 'Must be a valid email.']
}

export {
	validateEmail,
	validatePassword,
	PasswordValidator,
	ValidationPassword,
	AuthFormState,
	isPasswordValid,
	inputRequired,
	inputEmailRequired,
	inputEmailNotRequired,
}
