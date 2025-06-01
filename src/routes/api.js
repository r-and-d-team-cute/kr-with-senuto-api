const express = require('express');
const authController = require('../controllers/authController');
const keywordController = require('../controllers/keywordController');
const searchController = require('../controllers/searchController');
const urlsAnalysisController = require('../controllers/urlsAnalysisController');
const domainVisibilityController = require('../controllers/domainVisibilityController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/test', auth, authController.testConnection);
router.get('/getCurrentUser', auth, authController.getCurrentUser);

// Dodajemy nowy endpoint GET do istniejących tras
router.get(
  '/getDomainStatisticsByParam',
  auth,
  domainVisibilityController.getDomainStatisticsByParam
);

router.get('/getTop15ByUrlParams', auth, urlsAnalysisController.getUrlTop15);
router.get(
  '/getTop3UrlResultsByParams',
  auth,
  searchController.getTop3UrlResultsByParams
);

router.get(
  '/analyzeUrlsByParams',
  auth,
  urlsAnalysisController.analyzeUrlsByParams
);

router.post('/getTop3Results', searchController.getTop3Results);
router.post('/analyzeUrls', auth, urlsAnalysisController.analyzeUrls);
router.post('/getTop15UrlPositions', urlsAnalysisController.analyzeUrlTop15);

router.post(
  '/getKeywordsPropositions',
  auth,
  keywordController.getKeywordsPropositions
);
router.post('/getRelatedKeywords', auth, keywordController.getRelatedKeywords);

router.post(
  '/getMultipleKeywordsPropositions',
  auth,
  keywordController.getMultipleKeywordsPropositions
);
router.post(
  '/getMultipleRelatedKeywords',
  auth,
  keywordController.getMultipleRelatedKeywords
);
router.post('/getMultipleTop3Results', searchController.getMultipleTop3Results);
router.post(
  '/analyzeMultipleUrls',
  auth,
  urlsAnalysisController.analyzeMultipleUrls
);

router.post(
  '/getDomainStatistics',
  auth,
  domainVisibilityController.getDomainStatistics
);

router.post(
  '/getPositionsHistory',
  auth,
  domainVisibilityController.getPositionsHistory
);

router.post(
  '/getDomainSections',
  auth,
  domainVisibilityController.getDomainSections
);

router.post('/getDomainUrls', auth, domainVisibilityController.getDomainUrls);

router.post(
  '/getDomainVisibilityData',
  auth,
  domainVisibilityController.getDomainVisibilityData
);

module.exports = router;
