const express = require('express');
const authController = require('../controllers/authController');
const keywordController = require('../controllers/keywordController');
const searchController = require('../controllers/searchController');
const urlsAnalysisController = require('../controllers/urlsAnalysisController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/test', auth, authController.testConnection);
router.get('/getCurrentUser', auth, authController.getCurrentUser);
router.post('/getTop3Results', searchController.getTop3Results);
router.post('/analyzeUrls', auth, urlsAnalysisController.analyzeUrls);

router.post(
  '/getKeywordsPropositions',
  auth,
  keywordController.getKeywordsPropositions
);
router.post('/getRelatedKeywords', auth, keywordController.getRelatedKeywords);

module.exports = router;
