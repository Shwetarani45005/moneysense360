const express = require('express');
const authenticate = require('../middlewares/auth.middleware.js');
const AnalysisReportsController = require('../controllers/analytics.controller.js');

const router = express.Router();

router.get('/risk_reports', authenticate, AnalysisReportsController.getRiskReports);
router.get('/risk_report/:form_id', authenticate, AnalysisReportsController.getRiskReport);
router.get('/cl_reports', authenticate, AnalysisReportsController.getClassificationReports);
router.get('/cl_report/:upload_id', authenticate, AnalysisReportsController.getClassificationReport);  
// router.get('/cat_risk_reports/:form_id/:upload_id', authenticate, AnalysisReportsController.getRiskCatReports);

module.exports = router;
