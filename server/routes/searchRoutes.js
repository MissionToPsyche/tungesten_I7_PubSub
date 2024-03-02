const express = require('express');
const searchRouter = express.Router();

const {searchDocsByTitle, searchDocsByFilters} = require('../controllers/searchController');

searchRouter.get('/byTitle', searchDocsByTitle);

searchRouter.get('/byFilters', searchDocsByFilters);

module.exports = searchRouter;