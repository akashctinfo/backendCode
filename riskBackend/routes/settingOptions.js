const express = require('express');
const optionSettingController = require('../controller/optionSettingController');
//const auth = require('../middleware/auth');
const router = express.Router();

router.post('/addRiskSettingOption', optionSettingController.addRiskSettingOption);
router.post('/updateRiskSettingOption', optionSettingController.updateRiskSettingOption);
router.post('/riskSettingOptionList', optionSettingController.riskSettingOptionList);





module.exports = router;