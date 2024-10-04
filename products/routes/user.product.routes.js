const express = require('express');
const router = express.Router();

const userProductController = require('../controllers/user.product.controller');

router.get('/all/products', userProductController.findUsersProducts);
router.get('/:username/products', userProductController.findUserProducts);
router.post('/:username/products', userProductController.insertUserProduct);
router.patch('/:username/products/:id', userProductController.updateUserProduct);
router.delete('/:username/products/:id', userProductController.deleteUserProduct); 

router.get('/stats1', userProductController.stats1)

module.exports = router;
