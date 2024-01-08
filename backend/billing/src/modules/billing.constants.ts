import { ControllerRoles, UserRole } from '@juicyllama/core'

export const billingRoles: ControllerRoles = {
	findAll: [UserRole.OWNER, UserRole.ADMIN],
}
