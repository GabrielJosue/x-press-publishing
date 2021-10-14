const express = require('express');
const apiRouter = express.Router();
const artistRouter = require('./artists');
// series router
const seriesRouter = require('./series');
// issues router 
const issuesRouter = require('./issues');
apiRouter.use('/artists',artistRouter);
apiRouter.use('/series',seriesRouter);
apiRouter.use('/issues',issuesRouter);
module.exports = apiRouter;