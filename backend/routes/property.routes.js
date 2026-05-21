// e.g., GET /api/properties/search

const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');

// API Public: Ai cũng xem được danh sách và tìm kiếm khách sạn
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getPropertyById);

module.exports = router;