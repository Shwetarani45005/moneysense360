const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../local_db_1.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

const initializeDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Risk forms table (only can be accessed through the users table)
    db.run(`
      CREATE TABLE IF NOT EXISTS risk_forms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        age INTEGER NOT NULL,
        volatility TEXT NOT NULL,
        horizon TEXT NOT NULL,
        emi REAL NOT NULL,
        growth REAL NOT NULL,
        income REAL NOT NULL,
        job_type TEXT NOT NULL,
        dependants INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Uploads Table (only can be accessed through the users table)
    db.run(`
      CREATE TABLE IF NOT EXISTS uploads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        file_loc TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) 
    `);

    // Classification_reports Table (only can be accessed by the uploads table, users table)
    db.run(`
      CREATE TABLE IF NOT EXISTS classification_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uploads_id INTEGER NOT NULL,
        file_loc TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        transaction_class TEXT NOT NULL,
        total_expenses REAL NOT NULL,
        total_deposits REAL NOT NULL,
        balance REAL NOT NULL,
        non_mandatory_expenses REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploads_id) REFERENCES uploads(id) ON DELETE CASCADE,
        FOREIGN KEY (file_loc) REFERENCES uploads(file_loc) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) 
    `);

    // Risk_reports Table (only can be accessed by the risk forms table, users table)
    db.run(`
      CREATE TABLE IF NOT EXISTS risk_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        risk_form_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        risk_score REAL NOT NULL,
        risk_band TEXT NOT NULL,
        profile_allocation TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (risk_form_id) REFERENCES risk_forms(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) 
    `);

    // Classification_categories Table (only can be accessed by the classification reports table)
    db.run(`
      CREATE TABLE IF NOT EXISTS classification_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        classification_report_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        type TEXT,
        count INTEGER,
        deposit_amount REAL,
        withdraw_amount REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classification_report_id) REFERENCES classification_reports(id) ON DELETE CASCADE
      ) 
    `);
  });

  console.log('Database tables initialized');
};

module.exports = { db, initializeDatabase };