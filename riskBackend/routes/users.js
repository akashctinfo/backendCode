const express = require('express');
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const router = express.Router();
router.post('/signup', userController.signUp)
router.post('/login', userController.login);
router.post('/forgetpassword', userController.forgetpassword);
router.post('/changepassword', userController.changepassword);
router.post('/sociallogin', userController.sociallogin);
router.post('/addUser',auth,userController.addUser);
router.post('/user-list',auth,userController.fetchUserList);
router.post('/verifyUser',userController.verifyUser);
router.post('/editUser',auth,userController.editUser);
router.post('/fetchDetails',auth,userController.getUserDetails);
router.post('/getUserPermission',auth,userController.getUserPermission);
router.post('/userTypeUpdate',auth,userController.userTypeUpdate);
router.post("/dummy",auth,userController.dummy);
router.post("/jobList", auth, userController.jobList);
router.post("/sendMobileOTP", userController.sendMobileOTP);
router.post("/linkUsers", userController.linkUsers);
router.post("/loginByUserId", userController.loginByUserId);

module.exports = router;