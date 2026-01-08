const { db } = require('../config/database.js');

class ClassificationReports {
  static async create(formData) {
    const { user_id, uploads_id, file_loc, transaction_class, non_mandatory_expenses, total_deposits, balance, total_expenses } = formData;

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO classification_reports (user_id, uploads_id, file_loc, transaction_class, non_mandatory_expenses, total_deposits, balance, total_expenses)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [user_id, uploads_id, file_loc, transaction_class, non_mandatory_expenses, total_deposits, balance, total_expenses], function(err) {
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
      db.all('SELECT * FROM classification_reports WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findByUploadId(uploadId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM classification_reports WHERE uploads_id = ? ORDER BY created_at DESC', [uploadId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }  

  static async findByFileLoc(fileLoc) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM classification_reports WHERE file_loc = ? ORDER BY created_at DESC', [fileLoc], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }  

  static async findByIds(uploadId, userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM classification_reports WHERE uploads_id = ? AND user_id = ?', [uploadId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = ClassificationReports;