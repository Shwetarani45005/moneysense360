const express = require('express');
const multer = require('multer');
const authenticate = require('../middlewares/auth.middleware.js');
const UploadController = require('../controllers/uploads.controller.js');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/', authenticate, UploadController.getRecords);
router.post('/file', authenticate, upload.single('file'), UploadController.uploadFile);

module.exports = router;