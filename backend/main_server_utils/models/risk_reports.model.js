const { db } = require('../config/database.js');

class RiskFormReports {
  static async create(formData) {
    const { user_id, risk_form_id, risk_score, risk_band, profile_allocation } = formData;

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO risk_reports (user_id, risk_form_id, risk_score, risk_band, profile_allocation)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(query, [user_id, risk_form_id, risk_score, risk_band, profile_allocation], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...formData });
        }
      });
    });
  }

  static async findById(userId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM risk_reports WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }


  static async findByRiskFormId(riskFormId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM risk_reports WHERE risk_form_id = ? ORDER BY created_at DESC', [riskFormId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findByIds(formId, userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM risk_reports WHERE risk_form_id = ? AND user_id = ?', [formId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = RiskFormReports;