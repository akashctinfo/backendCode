const express = require('express');
const teamController = require('../controller/teamController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/addTeam', auth, teamController.addTeam);
router.post('/editTeam', auth, teamController.editTeam);
router.post('/getTeamDetail', auth, teamController.getTeamDetail);
router.post('/getTeamList', auth, teamController.getTeamList);
router.post('/deleteTeam', auth, teamController.deleteTeam);



module.exports = router;