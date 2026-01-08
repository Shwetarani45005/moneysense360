const { db } = require('../config/database.js');

class RiskForm {
  static async create(formData) {
    const { user_id, age, volatility, horizon, emi, growth, income, dependants, job_type } = formData;

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO risk_forms (user_id, age, volatility, horizon, emi, growth, income, dependants, job_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [user_id, age, volatility, horizon, emi, growth, income, dependants, job_type], function(err) {
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
      db.all('SELECT * FROM risk_forms WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findByIds(formId, userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM risk_forms WHERE id = ? AND user_id = ?', [formId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = RiskForm;