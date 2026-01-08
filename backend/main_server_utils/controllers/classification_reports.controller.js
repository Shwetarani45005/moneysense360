const ClassificationReports = require('../models/classification_reports.model.js');
const ClassificationCategories = require('../models/classification_categories.model.js');

class ClassificationReportsController {
  static async create(req, res) {
    try {
      const { uploads_id, file_loc, transsaction_class, non_mandatory_expenses, total_deposits, balance, total_expenses } = req.body;
      const user_id = req.user.id;

      if (!age || !volatility || !horizon || !emi || !job_type === undefined || 
          growth === undefined || income === undefined || dependants === undefined) {
        return res.status(400).json({ 
          error: { message: 'All fields are required', status: 400 } 
        });
      }

      const classificationReport = await ClassificationReports.create({
        user_id,
        uploads_id,
        file_loc, 
        transsaction_class, 
        non_mandatory_expenses, 
        total_deposits, 
        balance, 
        total_expenses
      });
            
      res.status(201).json({
        message: 'Classification report created successfully',
        data: classificationReport
      });
    } catch (error) {
      console.error('Create classification report error:', error);
      res.status(500).json({ 
        error: { message: 'Error creating classification report', status: 500 } 
      });
    }
  }

  static async getClassificationReports(req, res) {
    try {
      const user_id = req.user.id;
      const clReport = await ClassificationReports.findById(user_id);
      const categorReport = await ClassificationCategories.findByReportId(clReport.id);

      res.json({
        message: 'Classification reports retrieved successfully',
        data: { clReport, categorReport }
      });
    } catch (error) {
      console.error('Get forms error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving forms', status: 500 } 
      });
    }
  }

  static async getClassificationReportById(req, res) {
    try {
      const { upload_id } = req.params;
      const user_id = req.user.id;

      const form = await ClassificationReports.findByUploadId(upload_id);

      if (!form) {
        return res.status(404).json({ 
          error: { message: 'Form not found', status: 404 } 
        });
      }

      res.json({
        message: 'Form retrieved successfully',
        data: form
      });
    } catch (error) {
      console.error('Get form error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving form', status: 500 } 
      });
    }
  }
}

module.exports = ClassificationReportsController;