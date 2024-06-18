const Purchase = require('../models/purchaseModel');
const Client = require('../models/clientModel'); // Certifique-se de importar o modelo de Cliente

const purchaseController = {
  /**
   * @description Get all purchases
   * @returns {Promise<*>} List of all purchases
   */
  async getAllPurchases(req, res) {
    try {
      const purchases = await Purchase.find().sort({ purchaseDate: -1 }).populate('client');
      res.status(200).json({ purchases });
    } catch (error) {
      console.error('Error getting all purchases:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @description Create a new purchase
   * @param {Object} req - Request body containing purchase data
   * @param {Object} res - Response object
   * @returns {Promise<*>} Created purchase
   */
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
  

  /**
   * @description Check for bugs such as null pointer references, unhandled exceptions, and more.
   * If you don't see anything obvious, reply that things look good and that the user can reply with a stack trace to get more information.
   */
  async checkForBugs() {
    // Check for null pointer references
    if (!req || !req.body || !req.body.clientId || !req.body.details || !req.body.totalAmount || !req.body.purchaseDate) {
      throw new Error('Requisição inválida');
    }
    
    // Check for correct types
    if (typeof req.body.clientId !== 'string' || typeof req.body.details !== 'string' || typeof req.body.totalAmount !== 'number' || typeof req.body.purchaseDate !== 'string') {
      throw new Error('Tipo de dado inválido');
    }
    
    // Check for correct format of purchaseDate
    const purchaseDateParsed = new Date(req.body.purchaseDate);
    if (isNaN(purchaseDateParsed.getTime())) {
      throw new Error('Formato de data inválido');
    }
    
    // Check if clientId already exists
    const existingPurchase = await Purchase.findOne({ client: clientId });
    if (existingPurchase) {
      throw new Error('Cliente já possui uma compra');
    }
  }

  /**
   * @description Get purchase by id
   * @param {String} id - Purchase id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<*>} Purchase with given id
   */
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

  /**
   * @description Update purchase by id
   * @param {String} id - Purchase id
   * @param {Object} req - Request body containing new purchase data
   * @param {Object} res - Response object
   * @returns {Promise<*>} Updated purchase
   */
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

  /**
   * @description Delete purchase by id
   * @param {String} id - Purchase id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<*>} None
   */
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

  /**
   * @description Get all purchases for a specific client
   * @param {String} clientId - Client id
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<*>} List of purchases for the given client
   */
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

