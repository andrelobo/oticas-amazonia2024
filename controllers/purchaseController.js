const Purchase = require('../models/purchaseModel');
const Client = require('../models/clientModel');

const purchaseController = {
  /**
   * @swagger
   * /purchases:
   *   get:
   *     summary: Retrieve all purchases
   *     responses:
   *       200:
   *         description: A list of purchases
   *       404:
   *         description: No purchases found
   *       500:
   *         description: Internal server error
   */
  async getAllPurchases(req, res) {
    try {
      const purchases = await Purchase.find()
        .sort({ purchaseDate: -1 })
        .populate('client')
        .exec();
      
      if (!purchases) {
        return res.status(404).json({ message: 'No purchases found' });
      }
      
      res.status(200).json({ purchases });
    } catch (error) {
      console.error('Error getting all purchases:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /purchases:
   *   post:
   *     summary: Create a new purchase
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               clientId:
   *                 type: string
   *               endereco:
   *                 type: string
   *               cpf:
   *                 type: string
   *               paymentMethod:
   *                 type: string
   *               oculos:
   *                 type: string
   *               armacaoRF:
   *                 type: string
   *               lenteRF:
   *                 type: string
   *               outros:
   *                 type: string
   *               totalAmount:
   *                 type: number
   *               sinal:
   *                 type: number
   *               purchaseDate:
   *                 type: string
   *                 format: date-time
   *               deliveryDate:
   *                 type: string
   *                 format: date-time
   *               purchaseStatus:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Purchase created successfully
   *       500:
   *         description: Internal server error
   */
  async createPurchase(req, res) {
    try {
      purchaseController ;

      const {
        clientId, 
        endereco, 
        cpf, /*  */
        paymentMethod, 
        oculos, 
        armacaoRF, 
        lenteRF, 
        outros, 
        totalAmount, 
        sinal, 
        purchaseDate, 
        deliveryDate, 
        purchaseStatus 
      } = req.body;

      const purchase = new Purchase({
        client: clientId,
        endereco,
        cpf,
        paymentMethod,
        oculos,
        armacaoRF,
        lenteRF,
        outros,
        totalAmount,
        sinal: sinal || 0,
        purchaseDate: new Date(purchaseDate),
        deliveryDate: new Date(deliveryDate),
        purchaseStatus: purchaseStatus || false,
      });

      const savedPurchase = await purchase.save();
      res.status(201).json(savedPurchase);
    } catch (error) {
      console.error('Error creating purchase:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // The following methods should have similar Swagger comments added.
  
  /**
   * @swagger
   * /purchases/{id}:
   *   get:
   *     summary: Retrieve a purchase by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the purchase
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A single purchase
   *       400:
   *         description: ID is required
   *       404:
   *         description: Purchase not found
   *       500:
   *         description: Internal server error
   */
  async getPurchaseById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    try {
      const purchase = await Purchase.findById(id).populate('client').exec();
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
   * @swagger
   * /purchases/{id}:
   *   put:
   *     summary: Update a purchase by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the purchase
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               client:
   *                 type: string
   *               endereco:
   *                 type: string
   *               cpf:
   *                 type: string
   *               paymentMethod:
   *                 type: string
   *               oculos:
   *                 type: string
   *               armacaoRF:
   *                 type: string
   *               lenteRF:
   *                 type: string
   *               outros:
   *                 type: string
   *               totalAmount:
   *                 type: number
   *               sinal:
   *                 type: number
   *               purchaseDate:
   *                 type: string
   *                 format: date-time
   *               deliveryDate:
   *                 type: string
   *                 format: date-time
   *               purchaseStatus:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Purchase updated successfully
   *       400:
   *         description: ID is required
   *       404:
   *         description: Purchase not found
   *       500:
   *         description: Internal server error
   */
  async updatePurchaseById(req, res) {
    const { id } = req.params;
    const {
      client, 
      endereco, 
      cpf, 
      paymentMethod, 
      oculos, 
      armacaoRF, 
      lenteRF, 
      outros, 
      totalAmount, 
      sinal, 
      purchaseDate, 
      deliveryDate, 
      purchaseStatus 
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      const updateFields = {};
      if (client !== undefined) updateFields.client = client;
      if (endereco !== undefined) updateFields.endereco = endereco;
      if (cpf !== undefined) updateFields.cpf = cpf;
      if (paymentMethod !== undefined) updateFields.paymentMethod = paymentMethod;
      if (oculos !== undefined) updateFields.oculos = oculos;
      if (armacaoRF !== undefined) updateFields.armacaoRF = armacaoRF;
      if (lenteRF !== undefined) updateFields.lenteRF = lenteRF;
      if (outros !== undefined) updateFields.outros = outros;
      if (totalAmount !== undefined) updateFields.totalAmount = totalAmount;
      if (sinal !== undefined) updateFields.sinal = sinal;
      if (purchaseDate !== undefined) updateFields.purchaseDate = purchaseDate;
      if (deliveryDate !== undefined) updateFields.deliveryDate = new Date(deliveryDate);
      if (purchaseStatus !== undefined) updateFields.purchaseStatus = purchaseStatus;

      const purchase = await Purchase.findByIdAndUpdate(id, updateFields, { new: true }).exec();

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
   * @swagger
   * /purchases/{id}:
   *   delete:
   *     summary: Delete a purchase by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the purchase
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Purchase deleted successfully
   *       400:
   *         description: ID is required
   *       500:
   *         description: Internal server error
   */
  async deletePurchaseById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    try {
      const purchase = await Purchase.findByIdAndRemove(id).exec();
      if (purchase && purchase.client) {
        await Client.findByIdAndUpdate(purchase.client, { $inc: { purchaseCount: -1 } }).exec();
      }
      res.status(200).json({ message: 'Purchase deleted successfully' });
    } catch (error) {
      console.error('Error deleting purchase by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /purchases/client/{clientId}:
   *   get:
   *     summary: Retrieve purchases by client ID
   *     parameters:
   *       - name: clientId
   *         in: path
   *         required: true
   *         description: The ID of the client
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of purchases for the client
   *       400:
   *         description: Client ID is required
   *       404:
   *         description: No purchases found for this client
   *       500:
   *         description: Internal server error
   */
  async getPurchasesByClientId(req, res) {
    const { clientId } = req.params;
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }
    try {
      const purchases = await Purchase.find({ client: clientId }).sort({ purchaseDate: -1 }).exec();
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
