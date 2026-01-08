const { db } = require('../config/database.js');

class ClassificationCategories {
  static async create(formData) {
    const { classification_report_id, category, type, count, withdraw_amount, deposit_amount } = formData;

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO classification_categories (classification_report_id, category, type, count, withdraw_amount, deposit_amount )
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [classification_report_id, category, type, count, withdraw_amount, deposit_amount], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...formData });
        }
      });
    });
  }

  static async findById(classificationReportId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM classification_categories WHERE classification_report_id = ? ORDER BY created_at DESC', [classificationReportId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findByIds(classificationReportId, userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM classification_categories WHERE classification_report_id = ? AND user_id = ?', [classificationReportId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = ClassificationCategories;