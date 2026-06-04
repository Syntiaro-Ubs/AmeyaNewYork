const path = require('path');
require('dotenv').config({ override: true });

let cachedToken = null;
let tokenExpiresAt = null;

/**
 * Obtains an OAuth token from FedEx.
 * Caches the token in memory to avoid requesting a new one on every tracking request.
 */
async function getFedExAccessToken() {
  const isSandbox = process.env.FEDEX_ENVIRONMENT === 'sandbox';
  const baseUrl = isSandbox ? 'https://apis-sandbox.fedex.com' : 'https://apis.fedex.com';

  // Return cached token if valid (giving a 30-second buffer)
  if (cachedToken && tokenExpiresAt && Date.now() < (tokenExpiresAt - 30000)) {
    return cachedToken;
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', process.env.FEDEX_CLIENT_ID);
    params.append('client_secret', process.env.FEDEX_CLIENT_SECRET);

    const response = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Auth failed with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Set expiry timestamp
    tokenExpiresAt = Date.now() + (data.expires_in * 1000);
    return cachedToken;
  } catch (error) {
    console.error('FedEx OAuth Token Error:', error.message);
    throw new Error(`Failed to authenticate with FedEx: ${error.message}`);
  }
}

/**
 * Fetches tracking details for a specific tracking number.
 */
async function fetchTrackingDetails(trackingNumber) {
  const isSandbox = process.env.FEDEX_ENVIRONMENT === 'sandbox';
  const baseUrl = isSandbox ? 'https://apis-sandbox.fedex.com' : 'https://apis.fedex.com';
  const token = await getFedExAccessToken();

  try {
    const response = await fetch(`${baseUrl}/track/v1/trackingnumbers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-locale': 'en_US'
      },
      body: JSON.stringify({
        trackingInfo: [
          {
            trackingNumberInfo: {
              trackingNumber: trackingNumber
            }
          }
        ],
        includeDetailedScans: true
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Tracking query failed with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    
    // Process and normalize response
    const trackResult = data.output?.completeTrackResults?.[0]?.trackResults?.[0];
    if (!trackResult || trackResult.error) {
      const errorMsg = trackResult?.error?.parameterList?.[0]?.value || 'Shipment tracking information not found';
      throw new Error(errorMsg);
    }

    return parseFedExResponse(trackResult);
  } catch (error) {
    console.error('FedEx Tracking Request Error:', error.message);
    throw error;
  }
}

/**
 * Helper to parse and simplify FedEx's nested response format.
 */
function parseFedExResponse(trackResult) {
  const latestStatusObj = trackResult.latestStatusDetail;
  const rawStatus = latestStatusObj?.code; // Status code e.g., 'DL', 'OD', 'SH'
  const description = latestStatusObj?.description || 'No updates available';
  
  // Normalize FedEx Status Codes to our database schema statuses
  let status = 'Processing';
  if (['DL', 'Delivered'].includes(rawStatus) || description.toLowerCase().includes('delivered')) {
    status = 'Delivered';
  } else if (['OD', 'Out for Delivery', 'HL'].includes(rawStatus) || description.toLowerCase().includes('out for delivery') || description.toLowerCase().includes('ready for recipient pickup') || description.toLowerCase().includes('held')) {
    status = 'Out for Delivery';
  } else if (['SH', 'PU', 'DP', 'AR', 'IT', 'In Transit', 'Transit', 'Departed', 'Arrived'].includes(rawStatus) || description.toLowerCase().includes('shipped') || description.toLowerCase().includes('transit') || description.toLowerCase().includes('picked up') || description.toLowerCase().includes('departed') || description.toLowerCase().includes('arrived')) {
    status = 'Shipped';
  } else if (['OC', 'Ordered'].includes(rawStatus)) {
    status = 'Ordered';
  } else if (['DE', 'SE'].includes(rawStatus)) {
    status = 'Exception'; // Delayed / Custom holds
  } else if (['CA'].includes(rawStatus)) {
    status = 'Cancelled';
  }

  // Parse scan history
  const scans = (trackResult.scanEvents || []).map(event => ({
    timestamp: event.date,
    status: event.eventType,
    description: event.eventDescription,
    location: event.scanLocation ? `${event.scanLocation.city || ''}, ${event.scanLocation.stateOrProvinceCode || ''} ${event.scanLocation.countryCode || ''}`.trim() : 'Unknown'
  }));

  // Fallback: If we have scan history, the package has been picked up, so it cannot be "Processing" or "Ordered"
  if (scans.length > 0 && ['Processing', 'Ordered'].includes(status)) {
    const latestScanDesc = scans[0].description?.toLowerCase() || '';
    if (latestScanDesc.includes('delivery') || latestScanDesc.includes('pickup') || latestScanDesc.includes('out for') || latestScanDesc.includes('held')) {
      status = 'Out for Delivery';
    } else {
      status = 'Shipped';
    }
  }

  // Find estimated delivery from dateAndTimes array
  const deliveryDateObj = trackResult.dateAndTimes?.find(d => d.type === 'ESTIMATED_DELIVERY') || 
                          trackResult.dateAndTimes?.find(d => d.type === 'ACTUAL_DELIVERY') ||
                          trackResult.dateAndTimes?.find(d => d.type === 'SHIP');

  return {
    trackingNumber: trackResult.trackingNumberInfo?.trackingNumber,
    status,
    description,
    estimatedDelivery: deliveryDateObj ? deliveryDateObj.dateTime : null,
    scans
  };
}

module.exports = { fetchTrackingDetails };
