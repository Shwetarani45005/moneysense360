const express = require('express');
const authenticate = require('../middlewares/auth.middleware.js');
const FormController = require('../controllers/forms.controller.js');

const router = express.Router();

router.post('/create', authenticate, FormController.createRiskForm);
router.get('/', authenticate, FormController.getUserForms);
router.get('/:form_id', authenticate, FormController.getFormById);

module.exports = router;