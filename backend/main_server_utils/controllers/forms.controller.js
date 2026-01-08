const RiskForm = require('../models/forms.model.js');
const riskProfileService = require('../utils/risk_profile_service.js')
const RiskFormReports = require('../models/risk_reports.model.js');

class FormController {
  static async createRiskForm(req, res) {
    try {
      const { age, volatility, horizon, emi, growth, income, dependants, job_type } = req.body;
      const user_id = req.user.id;

      if (!age || !volatility || !horizon || !emi || !job_type === undefined || 
          growth === undefined || income === undefined || dependants === undefined) {
        return res.status(400).json({ 
          error: { message: 'All fields are required', status: 400 } 
        });
      }
      
      const form = await RiskForm.create({
        user_id,
        age,
        volatility,
        horizon,
        emi,
        growth,
        income,
        dependants,
        job_type
      });

      const riskProfile = new riskProfileService().generateProfile(form);

      const riskReport = await RiskFormReports.create({
        user_id,
        risk_form_id: form.id,
        risk_score: riskProfile.risk_score,
        risk_band: riskProfile.risk_band,
        profile_allocation: JSON.stringify(riskProfile.portfolio_allocation)
        // profile_allocation: riskProfile.portfolio_allocation
      });

      res.status(201).json({
        message: 'Risk form created successfully',
        // data: { form, riskProfile }
        data: form,
        riskProfile 
      });
    } catch (error) {
      console.error('Create form error:', error);
      res.status(500).json({ 
        error: { message: 'Error creating risk form', status: 500 } 
      });
    }
  }

  static async getUserForms(req, res) {
    try {
      const user_id = req.user.id;
      const forms = await RiskForm.findById(user_id);

      console.log('\n\n THE FORMS DATA DETAILS: ', forms, '\n\n');

      if (!forms) {
        return res.status(404).json({ 
          error: { message: 'No forms found', status: 404 } 
        });
      }

      res.status(200).json({
        message: 'Forms retrieved successfully',
        data: forms,
      });
    } catch (error) {
      console.error('Get forms error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving forms', status: 500 } 
      });
    }
  }

  static async getFormById(req, res) {
    try {
      const { form_id } = req.params;
      const user_id = req.user.id;

      const form = await RiskForm.findById(form_id, user_id);

      if (!form) {
        return res.status(404).json({ 
          error: { message: 'Form not found', status: 404 } 
        });
      }

      res.status(200).json({
        message: 'Form retrieved successfully',
        data: form,
      });
    } catch (error) {
      console.error('Get form error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving form', status: 500 } 
      });
    }
  }
}

module.exports = FormController;