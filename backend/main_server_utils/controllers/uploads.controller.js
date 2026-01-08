const axios = require('axios');
const FormData = require('form-data');
const Uploads = require("../models/upload.model")
const ClassificationReports = require('../models/classification_reports.model.js');
const ClassificationCategories = require('../models/classification_categories.model.js');

class UploadController {
  static async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: { message: 'No file uploaded', status: 400 } 
        });
      }

      // Validate file type
      const allowedMimeTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: { message: 'Invalid file type. Only CSV and XLSX files are allowed', status: 400 } 
        });
      }

      // Create form data to send to FastAPI server
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });

      // Forward to FastAPI server
      // const fastapiUrl = `{process.env.FASTAPI_URL}/classify/file` || 'http://localhost:8000/classify/file';
      const fastapiUrl = 'http://localhost:8000/classify/file';
      
      const response = await axios.post(fastapiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const upload = await Uploads.create({
        user_id: req.user.id,
        file_loc: response.data.file_loc,
        file_name: response.data.file_name,
      })

      const classification_details = response.data.classification_details;
      
      const clReport =await ClassificationReports.create({
        user_id: req.user.id,
        uploads_id: upload.id,
        file_loc: response.data.file_loc,
        transaction_class: classification_details.transactions_net_classification || 'Unclassified',
        non_mandatory_expenses: classification_details.non_mandatory_expenses,
        total_deposits: classification_details.total_deposits,
        balance: classification_details.total_balance,
        total_expenses: classification_details.total_expenses,
      })

      const categoryWiseDetails = classification_details.transaction_category;
      console.log("\n\nCATEGORY WISE DETAILS:\n", categoryWiseDetails);

      for (let key in categoryWiseDetails) {
        console.log("\n\nCATEGORY KEY:", key);
          if (categoryWiseDetails.hasOwnProperty(key))
            await ClassificationCategories.create({
              classification_report_id: clReport.id,
              category: key,
              type: categoryWiseDetails[key].type,
              count: categoryWiseDetails[key].count,
              withdraw_amount: categoryWiseDetails[key].withdraw,
              deposit_amount: categoryWiseDetails[key].deposit,
            });
        }

      console.log("\n\nCLASSIFICATION DETAILS:\n", response.data.classification_details);
      console.log("\n\nCLASSIFICATION DETAILS:\n", response.data.classification_details.transaction_category);

      res.json({
        message: 'File processed successfully',
        data: {upload, clReport, categoryWiseDetails},
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      if (error.response) {
        // FastAPI server responded with error
        return res.status(error.response.status).json({
          error: {
            message: 'Error from classification service',
            details: error.response.data,
            status: error.response.status
          }
        });
      }

      res.status(500).json({ 
        error: { message: 'Error processing file', status: 500 } 
      });
    }
  }

  static async getRecords(req, res) {
    try {
      const user_id = req.user.id;
      const uploads = await Uploads.findById(user_id);

      res.json({
        message: 'Uploaded records retrieved successfully',
        data: uploads
      });
    } catch (error) {
      console.error('Get forms error:', error);
      res.status(500).json({ 
        error: { message: 'Error retrieving forms', status: 500 } 
      });
    }
  }
}

module.exports = UploadController;