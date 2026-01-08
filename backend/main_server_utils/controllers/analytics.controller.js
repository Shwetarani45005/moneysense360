const ClassificationReports = require('../models/classification_reports.model.js');
const ClassificationCategories = require('../models/classification_categories.model.js');
const RiskFormReports = require('../models/risk_reports.model.js');
const Utils = require('../models/utils.js');

class AnalysisReportsController {
  static async getRiskReport(req, res) {
    try {
      const { form_id } = req.params;
      const user_id = req.user.id;
      const report = await RiskFormReports.findByIds(form_id, user_id);
      if (!report) {
        return res.status(404).json({ 
          error: { message: 'No Risk Reports found', status: 404 } 
        });
      }
      res.json({
        message: 'Risk Report retrieved successfully',
        data: report
      });
    } catch (error) {
        console.error('Get forms error:', error);
        res.status(500).json({ 
          error: { message: 'Error retrieving forms', status: 500 } 
        });
      }
    }

  static async getRiskReports(req, res) {
    try {
      const user_id = req.user.id;
      const reports = await RiskFormReports.findById(user_id);
      if (!reports) {
        return res.status(404).json({ 
          error: { message: 'No Risk Reports found', status: 404 } 
        });
      }
      res.json({
        message: 'Risk Reports retrieved successfully',
        data: reports
      });
    } catch (error) {
      console.error('Get forms error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving forms', status: 500 } 
      });
    }
  }

  static async getClassificationReport(req, res) {
    try {
      const { upload_id } = req.params;
      const user_id = req.user.id;

      const cls_report = await ClassificationReports.findByIds(upload_id, user_id);
      if (!cls_report) {
        return res.status(404).json({ 
          error: { message: 'No Risk Reports found', status: 404 } 
        });
      }
      const cat_classification = await ClassificationCategories.findById(cls_report.id);
      res.json({
        message: 'Forms retrieved successfully',
        data: { cls_report, cat_classification }
      });
    } catch (error) {
      console.error('Get forms error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving forms', status: 500 } 
      });
    }
  }

  static async getClassificationReports(req, res) {
    try {
      const user_id = req.user.id;

      let reports = []
      const cls_reports = await ClassificationReports.findById(user_id);
      if (!cls_reports) {
        return res.status(404).json({ 
          error: { message: 'No Risk Reports found', status: 404 } 
        });
      }
      for (let report of cls_reports) {
        console.log(report)
        const cat_classification = await ClassificationCategories.findById(report.id);
        reports.push({ cls_report: report, cat_classification });
      }
      
      res.json({
        message: 'Classification Reports retrieved successfully',
        data: reports
      });
    } catch (error) {
      console.error('Get forms error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving forms', status: 500 } 
      });
    }
  }

  static async getCatRiskReports(req, res) {
    try {
      const { form_id, upload_id } = req.params;
      const user_id = req.user.id;
      const report = await Utils.getAnalyticsData(upload_id, form_id, user_id);
      if (!report) {
        return res.status(404).json({ 
          error: { message: 'No Risk Reports found', status: 404 } 
        });
      }
      res.json({
        message: 'Risk Report retrieved successfully',
        data: report
      });
    }
    catch (error) {
      console.error('Get forms error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving Risk and Category Reports', status: 500 } 
    })};
  } 
}


module.exports = AnalysisReportsController;