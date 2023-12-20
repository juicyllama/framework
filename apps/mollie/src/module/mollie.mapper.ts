import { PaymentStatus } from '@juicyllama/billing'
import * as Mollie from '@mollie/api-client'
export function molliePaymentStatus(status: Mollie.PaymentStatus): PaymentStatus {
	switch (status) {
		case Mollie.PaymentStatus.pending:
		case Mollie.PaymentStatus.open:
		case Mollie.PaymentStatus.expired:
			return PaymentStatus.pending
		case Mollie.PaymentStatus.failed:
		case Mollie.PaymentStatus.canceled:
			return PaymentStatus.declined
		case Mollie.PaymentStatus.authorized:
		case Mollie.PaymentStatus.paid:
			return PaymentStatus.success
	}
}
