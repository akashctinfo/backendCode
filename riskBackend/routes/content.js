const express = require('express');
const contentController = require('../controller/contentController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/uploadDocument', upload.single('file'), auth, contentController.uploadDocument);
router.post('/addDocument', upload.single('file'), auth, contentController.addDocument);
router.post('/documentList', auth, contentController.documentList);
router.post('/documentDetail', auth, contentController.documentDetail);
router.post('/editDocument', upload.single('file'), auth, contentController.editDocument);
router.get('/documentCategoryList', auth, contentController.documentCategoryList);
router.post('/addDocumentSection', auth, contentController.addDocumentSection);
router.post('/editDocumentSection', auth, contentController.editDocumentSection);
router.post('/documentSectionList', auth, contentController.documentSectionList);
router.post('/documentSectionDetail', auth, contentController.documentSectionDetail);
router.post('/deleteDocumentSection', auth, contentController.deleteDocumentSection);
router.get('/contentAttributeList', auth, contentController.contentAttributeList);
router.post('/updatedocumentBysection', auth, contentController.updatedocumentBysection);


module.exports = router;