const express = require('express');
const crypto = require('crypto');
const router = express.Router();
require('dotenv').config({ override: true });

const PHONEPE_BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

/**
 * POST /api/payment/initiate
 * Prepares the Base64 request body, computes the secure X-VERIFY checksum,
 * and calls PhonePe to get the transaction redirect URL.
 */
router.post('/initiate', async (req, res) => {
  const { amount, transactionId, userId } = req.body;

  if (!amount || !transactionId) {
    return res.status(400).json({ success: false, message: 'Amount and transactionId are required.' });
  }

  // Convert amount to Paise (PhonePe expects amounts in Paise, e.g. ₹10.50 = 1050 paise)
  const amountInPaise = Math.round(parseFloat(amount) * 100);

  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX;

  // Setup UAT Redirect and callback URLs
  // Frontend will handle redirect success/failure based on transaction status
  const redirectUrl = `http://localhost:5173/checkout?txnId=${transactionId}`;
  
  const paymentPayload = {
    merchantId: merchantId,
    merchantTransactionId: transactionId,
    merchantUserId: userId || 'guest_user',
    amount: amountInPaise,
    redirectUrl: redirectUrl,
    redirectMode: 'REDIRECT',
    // In a public live scenario, PhonePe will hit this webhook callback URL server-to-server.
    // Since we are locally testing, we will rely on the direct status query API.
    callbackUrl: 'https://webhook.site/placeholder-callback',
    paymentInstrument: {
      type: 'PAY_PAGE'
    }
  };

  try {
    const payloadString = JSON.stringify(paymentPayload);
    const base64Payload = Buffer.from(payloadString).toString('base64');
    
    // Checksum calculation: SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
    const verifyString = base64Payload + '/pg/v1/pay' + saltKey;
    const sha256 = crypto.createHash('sha256').update(verifyString).digest('hex');
    const xVerifyHeader = `${sha256}###${saltIndex}`;

    console.log(`Initiating PhonePe payment for Txn ID: ${transactionId}, Amount: ₹${amount}`);

    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('PhonePe PG Pay API Error:', data);
      return res.status(response.status || 500).json({
        success: false,
        message: data.message || 'Payment initiation failed with PhonePe.'
      });
    }

    // Extract the redirection URL returned by PhonePe
    const payUrl = data.data?.instrumentResponse?.redirectInfo?.url;

    res.json({
      success: true,
      redirectUrl: payUrl
    });

  } catch (error) {
    console.error('PhonePe initiate payment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error while initiating payment.'
    });
  }
});

/**
 * POST /api/payment/status
 * Queries PhonePe server to verify if the payment was actually successful.
 */
router.post('/status', async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ success: false, message: 'transactionId is required.' });
  }

  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX;

  try {
    // Checksum calculation: SHA256("/pg/v1/status/" + merchantId + "/" + transactionId + saltKey) + "###" + saltIndex
    const verifyString = `/pg/v1/status/${merchantId}/${transactionId}${saltKey}`;
    const sha256 = crypto.createHash('sha256').update(verifyString).digest('hex');
    const xVerifyHeader = `${sha256}###${saltIndex}`;

    console.log(`Checking PhonePe transaction status for Txn ID: ${transactionId}`);

    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/status/${merchantId}/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader,
        'X-MERCHANT-ID': merchantId
      }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('PhonePe PG Status API Error:', data);
      return res.status(response.status || 500).json({
        success: false,
        code: data.code,
        message: data.message || 'Payment status check failed.'
      });
    }

    // PhonePe Transaction Code definitions:
    // PAYMENT_SUCCESS, PAYMENT_ERROR, PAYMENT_PENDING, etc.
    res.json({
      success: true,
      paymentStatus: data.code, // e.g. "PAYMENT_SUCCESS"
      message: data.message
    });

  } catch (error) {
    console.error('PhonePe check status error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking payment status.'
    });
  }
});

module.exports = router;
