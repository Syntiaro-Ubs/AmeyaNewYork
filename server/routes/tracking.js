const express = require('express');
const router = express.Router();
const { fetchTrackingDetails } = require('../utils/fedexService');
const db = require('../db');

/**
 * GET /api/tracking/:trackingNumber
 * Fetches real-time status from FedEx, caches it in the shipments MySQL table, and returns the status.
 */
router.get('/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;

  if (!trackingNumber || trackingNumber.trim() === '') {
    return res.status(400).json({ success: false, message: 'Tracking number is required' });
  }

  try {
    // 1. Fetch live tracking status from FedEx API
    const trackingData = await fetchTrackingDetails(trackingNumber);

    // 2. Cache it in the database (MySQL UPSERT: INSERT ... ON DUPLICATE KEY UPDATE)
    await db.query(
      `INSERT INTO shipments (tracking_number, status, description, estimated_delivery) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         status = VALUES(status), 
         description = VALUES(description), 
         estimated_delivery = VALUES(estimated_delivery),
         last_updated = CURRENT_TIMESTAMP`,
      [
        trackingData.trackingNumber,
        trackingData.status,
        trackingData.description,
        trackingData.estimatedDelivery
      ]
    );

    // 3. Return response to frontend
    res.json({
      success: true,
      data: trackingData
    });

  } catch (error) {
    console.error(`Tracking API error for ${trackingNumber}:`, error.message);

    // Graceful Fallback: Query local database cache if external API fails
    try {
      const [rows] = await db.query(
        'SELECT status, description, estimated_delivery, last_updated FROM shipments WHERE tracking_number = ?',
        [trackingNumber]
      );

      if (rows && rows.length > 0) {
        console.log(`Fallback: Loaded cached tracking data from database for ${trackingNumber}`);
        return res.json({
          success: true,
          cached: true,
          data: {
            trackingNumber,
            status: rows[0].status,
            description: rows[0].description,
            estimatedDelivery: rows[0].estimated_delivery,
            scans: [] // Scan history might be empty in fallback, but keeps frontend running
          }
        });
      }
    } catch (dbError) {
      console.error('Fallback database read error:', dbError.message);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Unable to retrieve tracking updates.'
    });
  }
});

module.exports = router;
