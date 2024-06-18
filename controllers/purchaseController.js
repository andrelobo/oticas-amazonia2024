const Purchase = require('../models/purchaseModel');
const Client = require('../models/clientModel'); // Certifique-se de importar o modelo de Cliente

const purchaseController = {
  async getAllPurchases(req, res) {
    try {
      const purchases = await Purchase.find().sort({ purchaseDate: -1 }).populate('client');
      res.status(200).json({ purchases });
    } catch (error) {
      console.error('Error getting all purchases:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async createPurchase(req, res) {
    const { clientId, details, totalAmount, purchaseDate, purchaseStatus } = req.body;
    
    if (!clientId || !details || !totalAmount || !purchaseDate) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
  
    try {
      const purchase = new Purchase({
        client: clientId,
        details,
        totalAmount,
        purchaseDate: new Date(purchaseDate),
        purchaseStatus: purchaseStatus || false,
      });
  
      const savedPurchase = await purchase.save();
      res.status(201).json(savedPurchase);
    } catch (error) {
      console.error('Erro ao criar a compra:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  

  async checkForBugs(req) {
    if (!req || !req.body || !req.body.clientId || !req.body.details || !req.body.totalAmount || !req.body.purchaseDate) {
      throw new Error('Requisição inválida');
    }
    
    if (typeof req.body.clientId !== 'string' || typeof req.body.details !== 'string' || typeof req.body.totalAmount !== 'number' || typeof req.body.purchaseDate !== 'string') {
      throw new Error('Tipo de dado inválido');
    }
    
    const purchaseDateParsed = new Date(req.body.purchaseDate);
    if (isNaN(purchaseDateParsed.getTime())) {
      throw new Error('Formato de data inválido');
    }
    
    const existingPurchase = await Purchase.findOne({ client: req.body.clientId });
    if (existingPurchase) {
      throw new Error('Cliente já possui uma compra');
    }
  },

  async getPurchaseById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    try {
      const purchase = await Purchase.findById(id).populate('client');
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      res.status(200).json({ purchase });
    } catch (error) {
      console.error('Error getting purchase by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updatePurchaseById(req, res) {
    const { id } = req.params;
    const { client, details, totalAmount, purchaseDate, purchaseStatus } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    if (!client && !details && !totalAmount && !purchaseDate && purchaseStatus === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const purchase = await Purchase.findByIdAndUpdate(
        id,
        { client, details, totalAmount, purchaseDate, purchaseStatus },
        { new: true }
      );
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      res.status(200).json({ purchase });
    } catch (error) {
      console.error('Error updating purchase by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async deletePurchaseById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    try {
      const purchase = await Purchase.findByIdAndRemove(id);
      if (purchase && purchase.client) {
        // Atualize o campo purchaseCount no documento Client
        await Client.findByIdAndUpdate(purchase.client, { $inc: { purchaseCount: -1 } });
      }
      res.status(200).json({ message: 'Purchase deleted successfully' });
    } catch (error) {
      console.error('Error deleting purchase by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getPurchasesByClientId(req, res) {
    const { clientId } = req.params;
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }
    try {
      const purchases = await Purchase.find({ client: clientId }).sort({ purchaseDate: -1 });
      if (!purchases.length) {
        return res.status(404).json({ message: 'No purchases found for this client' });
      }
      res.status(200).json({ purchases });
    } catch (error) {
      console.error('Error getting purchases for client:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

};

module.exports = purchaseController;

