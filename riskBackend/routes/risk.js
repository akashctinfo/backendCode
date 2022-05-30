const express = require('express');
const riskController = require('../controller/riskController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/riskList',riskController.riskList);
router.post('/addRisk', riskController.addRisk);
router.post('/editRisk', riskController.editRisk);
router.post('/riskDetail', riskController.riskDetail);
router.post('/riskExcelGenerate', riskController.riskExcelGenerate);

module.exports = router;