const express = require('express');
const router = express.Router();

const userProductController = require('../controllers/user.product.controller');

router.get('/', userProductController.findAll);

module.exports = router;
