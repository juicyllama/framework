import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordCriteria from '@/components/core/auth/PasswordCriteria.vue'
import { AuthFormState } from '@'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'

describe('Password Criteria', () => {
	installQuasarPlugin()
	describe('character length rule', () => {
		it('shows error icon', () => {
			const authFormState: AuthFormState = {
				password: {
					value: '!aA45678',
					valid: {
						length: false,
						capital: true,
						number: true,
						symbol: true,
					},
				},
			}
			const wrapper = mount(PasswordCriteria, {
				props: {
					authFormState,
				},
			})
			const icons = wrapper.findAll('.q-icon')
			expect(icons[0].classes()).includes('fa-circle-xmark')
		})
		it('shows check icon', () => {
			const authFormState: AuthFormState = {
				password: {
					value: '!a4567891112',
					valid: {
						length: true,
						capital: false,
						number: true,
						symbol: true,
					},
				},
			}
			const wrapper = mount(PasswordCriteria, {
				props: {
					authFormState,
				},
			})
			const icons = wrapper.findAll('.q-icon')
			expect(icons[0].classes()).includes('fa-circle-check')
		})
	})

	describe('capital letter rule', () => {
		it('shows error icon', () => {
			const authFormState: AuthFormState = {
				password: {
					value: '!abcdefg45678',
					valid: {
						length: true,
						capital: false,
						number: true,
						symbol: true,
					},
				},
			}
			const wrapper = mount(PasswordCriteria, {
				props: {
					authFormState,
				},
			})
			const icons = wrapper.findAll('.q-icon')
			expect(icons[1].classes()).includes('fa-circle-xmark')
		})
		it('shows check icon', () => {
			const authFormState: AuthFormState = {
				password: {
					value: '!aA4562',
					valid: {
						length: false,
						capital: true,
						number: true,
						symbol: true,
					},
				},
			}
			const wrapper = mount(PasswordCriteria, {
				props: {
					authFormState,
				},
			})
			const icons = wrapper.findAll('.q-icon')
			expect(icons[1].classes()).includes('fa-circle-check')
		})
	})

	describe('number rule', () => {
		it('shows error icon', () => {
			const authFormState: AuthFormState = {
				password: {
					value: '!aAbcdefghhjaasad',
					valid: {
						length: true,
						capital: true,
						number: false,
						symbol: true,
					},
				},
			}
			const wrapper = mount(PasswordCriteria, {
				props: {
					authFormState,
				},
			})
			const icons = wrapper.findAll('.q-icon')
			expect(icons[2].classes()).includes('fa-circle-xmark')
		})
		it('shows check icon', () => {
			const authFormState: AuthFormState = {
				password: {
					value: '!a4567891112',
					valid: {
						length: true,
						capital: false,
						number: true,
						symbol: true,
					},
				},
			}
			const wrapper = mount(PasswordCriteria, {
				props: {
					authFormState,
				},
			})
			const icons = wrapper.findAll('.q-icon')
			expect(icons[2].classes()).includes('fa-circle-check')
		})
	})

	describe('special character rule', () => {
		it('shows error icon', () => {
			const authFormState: AuthFormState = {
				password: {
					value: '123456789aA45678',
					valid: {
						length: true,
						capital: true,
						number: true,
						symbol: false,
					},
				},
			}
			const wrapper = mount(PasswordCriteria, {
				props: {
					authFormState,
				},
			})
			const icons = wrapper.findAll('.q-icon')
			expect(icons[3].classes()).includes('fa-circle-xmark')
		})
		it('shows check icon', () => {
			const authFormState: AuthFormState = {
				password: {
					value: 'a45678911123',
					valid: {
						length: true,
						capital: false,
						number: true,
						symbol: true,
					},
				},
			}
			const wrapper = mount(PasswordCriteria, {
				props: {
					authFormState,
				},
			})
			const icons = wrapper.findAll('.q-icon')
			expect(icons[3].classes()).includes('fa-circle-check')
		})
	})
})
