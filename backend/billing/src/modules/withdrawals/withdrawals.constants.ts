import { Withdrawal } from './withdrawals.entity'

export const BILLING_WITHDRAWAL_NAME = 'withdrawal'
export const CRON_BILLING_WITHDRAWALS_SETTLE_DOMAIN = 'billing::withdrawals::cron::service::settleWithdrawals'

export const BILLING_WITHDRAWAL_E = Withdrawal
export type BILLING_WITHDRAWAL_T = Withdrawal
