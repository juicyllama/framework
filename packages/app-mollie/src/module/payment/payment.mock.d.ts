import { DeepPartial } from 'typeorm';
import { MolliePayment } from './payment.entity';
import { Payment } from '@mollie/api-client';
export default function (data: DeepPartial<MolliePayment>): Payment;
