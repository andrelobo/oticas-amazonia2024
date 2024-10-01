// clientRoutes :
const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');
const purchaseController = require('../controllers/purchaseController');

const authenticateToken = require('../middlewares/authenticateToken');

// Rota para criar um novo cliente
router.post('/', authenticateToken, ClientController.createClient);


// Rota para obter detalhes de um usuário pelo ID
router.get('/:id', authenticateToken, ClientController.getClientById);

// Rota para atualizar os detalhes de um usuário pelo ID
router.put('/:id', authenticateToken, ClientController.updateClientById);

// Rota para excluir um usuário pelo ID
router.delete('/:id',  ClientController.deleteClientById);

// Rota para listar todos os usuários
router.get('/', ClientController.getAllClients);

router.get('/:clientId', authenticateToken, ClientController.getClientWithPurchases);

module.exports = router;

