const express = require('express');
const orgController = require('../controller/orgController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/editOrg', auth, orgController.editOrg);
router.post('/getOrgDetail', auth, orgController.getOrgDetails);


module.exports = router;