const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permissionController = require('../controller/permissionController');
router.post('/addRolepermission',auth,permissionController.addRolepermission);
router.post('/userTypeList',auth,permissionController.fetchPermission);
router.post('/getRolepermission',auth,permissionController.getRolepermission);
router.post('/resetPermission',auth,permissionController.resetPermission);

module.exports = router;