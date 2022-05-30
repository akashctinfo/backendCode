const express = require('express');
const settingController = require('../controller/settingController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/getSettingList', auth, settingController.getSettingList);
router.post('/editSetting', auth, settingController.editSetting);
router.post('/addSetting', auth, settingController.addSetting);
router.post('/addSettingUser', auth,settingController.addSettingUser);





module.exports = router;