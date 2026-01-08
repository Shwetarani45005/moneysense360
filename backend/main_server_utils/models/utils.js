const { db } = require('../config/database.js');

class Utils {
  /**
   * Get comprehensive analytics data for a user
   * Combines risk reports, classification reports, and classification categories
   * @param {number} userId - User ID to fetch data for
   * @returns {Promise<Object>} Combined analytics data
   */
  static async getAnalyticsData(uploadId, formId, userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          -- Risk Report fields
          r.id AS risk_report_id,
          r.risk_score,
          r.risk_band,
          r.profile_allocation,
          r.created_at AS risk_report_date,
          
          -- Classification Report fields
          cr.id AS classification_report_id,
          cr.transaction_class,
          cr.total_expenses,
          cr.total_deposits,
          cr.balance,
          cr.non_mandatory_expenses,
          cr.file_loc,
          cr.uploads_id,
          cr.created_at AS classification_report_date,
          
          -- Classification Category fields
          cc.id AS category_id,
          cc.category,
          cc.type,
          cc.count,
          cc.deposit_amount,
          cc.withdraw_amount
          
        FROM risk_reports AS r
        LEFT JOIN classification_reports AS cr 
          ON r.user_id = cr.user_id
          AND cr.uploads_id = ?
        LEFT JOIN classification_categories AS cc 
          ON cr.id = cc.classification_report_id
        WHERE r.user_id = ?
        AND r.id = ?
        ORDER BY r.created_at DESC, cr.created_at DESC
      `;

      db.all(query, [uploadId, userId, formId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}