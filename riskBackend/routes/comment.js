const express = require('express');
const commentController = require('../controller/commentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/addRiskComment', commentController.addRiskComment);
router.post('/editRiskComment', commentController.editRiskComment);
router.post('/riskCommentList', commentController.riskCommentList);
router.post('/addFavCommentRisk', commentController.addFavCommentRisk);
router.post('/addActionComment', commentController.addActionComment);
router.post('/editActionComment', commentController.editActionComment);
router.post('/actionCommentList', commentController.actionCommentList);
router.post('/addFavCommentAction', commentController.addFavCommentAction);


module.exports = router;