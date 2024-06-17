// PurchaseRoutes :
const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchaseController');
// const authenticateToken = require('../middlewares/authenticateToken');


router.post('/' , PurchaseController.createPurchase);


// Rota para obter detalhes de um usuário pelo ID
router.get('/:id', PurchaseController.getPurchaseById);

// Rota para atualizar os detalhes de um usuário pelo ID
router.put('/:id', PurchaseController.updatePurchaseById);

// Rota para excluir um usuário pelo ID
router.delete('/:id' , PurchaseController.deletePurchaseById);

// Rota para listar todos os usuários
router.get('/', PurchaseController.getAllPurchases);
router.get('/client/:clientId', PurchaseController.getPurchasesByClientId);

module.exports = router;

