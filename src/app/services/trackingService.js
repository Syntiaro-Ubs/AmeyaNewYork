const TRACKING_API_BASE = 'http://localhost:5000/api/tracking';

/**
 * Fetches real-time tracking status from the backend.
 * @param {string} trackingNumber The shipping tracking number
 * @returns {Promise<object>} The tracking response payload from FedEx
 */
export async function getLiveTracking(trackingNumber) {
  try {
    const response = await fetch(`${TRACKING_API_BASE}/${trackingNumber}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch tracking details (Status ${response.status})`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching live tracking:', error);
    throw error;
  }
}
