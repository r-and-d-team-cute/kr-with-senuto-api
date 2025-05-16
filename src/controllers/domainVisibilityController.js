const domainVisibilityService = require('../services/domainVisibilityService');

exports.getDomainStatistics = async (req, res) => {
  try {
    const { domain } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Nie podano domeny do analizy',
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Brak tokenu autoryzacyjnego',
      });
    }

    const stats = await domainVisibilityService.getDomainStatistics(
      domain,
      token
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Błąd w kontrolerze getDomainStatistics:', error);

    // Jeśli to błąd walidacji domeny, zwracamy 400
    if (error.message.includes('format')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDomainStatisticsByParam = async (req, res) => {
  try {
    const { domain } = req.query;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Nie podano domeny do analizy',
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Brak tokenu autoryzacyjnego',
      });
    }

    const stats = await domainVisibilityService.getDomainStatistics(
      domain,
      token
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Błąd w kontrolerze getDomainStatisticsByParam:', error);

    // Jeśli to błąd walidacji domeny, zwracamy 400
    if (error.message.includes('format')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPositionsHistory = async (req, res) => {
  try {
    const { domain } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Nie podano domeny do analizy',
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Brak tokenu autoryzacyjnego',
      });
    }

    const historyData = await domainVisibilityService.getPositionsHistory(
      domain,
      token
    );

    res.json({
      success: true,
      data: historyData,
    });
  } catch (error) {
    console.error('Błąd w kontrolerze getPositionsHistory:', error);

    if (error.message.includes('format')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDomainSections = async (req, res) => {
  try {
    const { domain } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Nie podano domeny do analizy',
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Brak tokenu autoryzacyjnego',
      });
    }

    const sectionsData = await domainVisibilityService.getDomainSections(
      domain,
      token
    );

    res.json({
      success: true,
      data: sectionsData,
    });
  } catch (error) {
    console.error('Błąd w kontrolerze getDomainSections:', error);

    if (error.message.includes('format')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDomainUrls = async (req, res) => {
  try {
    const { domain } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Nie podano domeny do analizy',
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Brak tokenu autoryzacyjnego',
      });
    }

    const urlsData = await domainVisibilityService.getDomainUrls(domain, token);

    res.json({
      success: true,
      data: urlsData,
    });
  } catch (error) {
    console.error('Błąd w kontrolerze getDomainUrls:', error);

    if (error.message.includes('format')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDomainVisibilityData = async (req, res) => {
  try {
    const { domain } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Nie podano domeny do analizy',
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Brak tokenu autoryzacyjnego',
      });
    }

    const aggregatedData =
      await domainVisibilityService.getDomainVisibilityData(domain, token);

    res.json({
      success: true,
      data: aggregatedData,
    });
  } catch (error) {
    console.error('Błąd w kontrolerze getDomainVisibilityData:', error);

    if (error.message.includes('format')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
