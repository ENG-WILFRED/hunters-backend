import { Injectable } from '@nestjs/common';

@Injectable()
export class MpesaService {
  // MPesa stub for payment processing
  // Replace these with actual MPesa API credentials

  initializePayment(phoneNumber: string, amount: number): { checkoutRequestId: string } {
    // Simulate MPesa C2B request
    const checkoutRequestId = `MPR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[MPesa] Initialized payment: ${phoneNumber} KES ${amount}, RequestId: ${checkoutRequestId}`);
    return { checkoutRequestId };
  }

  validateCallback(payload: any): boolean {
    // Validate MPesa callback signature - add real validation here
    // For now just check that amount and receipt are present
    return !!(payload.amount && (payload.receipt || payload.mpesaReceiptNumber));
  }

  parseCallback(payload: any) {
    // Extract relevant info from MPesa callback
    return {
      amount: payload.amount,
      phoneNumber: payload.msisdn || payload.phoneNumber,
      receipt: payload.receipt || payload.mpesaReceiptNumber,
      transactionDate: payload.transactionDate || new Date(),
    };
  }
}
