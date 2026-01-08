const { db } = require('../config/database.js');

class Uploads {
  static async create(formData) {
    const { user_id, file_name, file_loc } = formData;

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO uploads (user_id, file_name, file_loc)
        VALUES (?, ?, ?)
      `;
      
      db.run(query, [user_id, file_name, file_loc], function(err) {
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
      db.all('SELECT * FROM uploads WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findByIds(uploadId, userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM uploads WHERE id = ? AND user_id = ?', [uploadId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = Uploads;