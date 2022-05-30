const express = require('express');
const actionController = require('../controller/actionController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/addAction', auth, actionController.addAction);
router.post('/editAction', auth, actionController.editAction);
router.post('/actionList', auth, actionController.actionList);
router.post('/actionDetail', auth, actionController.actionDetail);


module.exports = router;