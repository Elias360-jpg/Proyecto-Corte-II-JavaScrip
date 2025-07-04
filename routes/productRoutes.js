const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// Rutas protegidas para productos
router.post('/', authenticateToken, authorizeRoles(['admin']), productController.createProduct);
router.get('/', authenticateToken, productController.getAllProducts); // Todos los usuarios autenticados pueden ver productos
router.get('/:id', authenticateToken, productController.getProductById);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), productController.deleteProduct);

module.exports = router;