const Purchase = require('../models/purchaseModel');

const purchaseController = {
  /**
   * @description Get all purchases
   * @returns {Promise<*>} List of all purchases
   */
  async getAllPurchases(req, res) {
    try {
      const purchases = await Purchase.find().sort({ purchaseDate: -1 });
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
    const { client, details, totalAmount } = req.body;
    if (!client || !details || !totalAmount  ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const newPurchase = new Purchase({ client, details, totalAmount, purchaseDate: new Date(), purchaseStatus: false }); 
      const savedPurchase = await newPurchase.save();
      res.status(201).json({ purchase: savedPurchase });
    } catch (error) {
      console.error('Error creating purchase:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

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
      const purchase = await Purchase.findById(id);
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
    const { client, details, totalAmount , purchaseDate, purchaseStatus} = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    if (!client && !details && !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const purchase = await Purchase.findByIdAndUpdate(id, { client, details, totalAmount , purchaseDate, purchaseStatus}, { new: true });
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
      await Purchase.findByIdAndRemove(id);
      res.status(200).json({ message: 'Purchase deleted successfully' });
    } catch (error) {
      console.error('Error deleting purchase by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = purchaseController;
