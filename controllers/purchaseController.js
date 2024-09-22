const Purchase = require('../models/purchaseModel');
const Client = require('../models/clientModel');

const purchaseController = {
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

  async createPurchase(req, res) {
    try {
      purchaseController.checkForBugs(req);

      const {
        clientId, 
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
        deliveryDate, // Novo campo
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
        deliveryDate: new Date(deliveryDate), // Novo campo
        purchaseStatus: purchaseStatus || false,
      });

      const savedPurchase = await purchase.save();
      res.status(201).json(savedPurchase);
    } catch (error) {
      console.error('Erro ao criar a compra:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  checkForBugs(req) {
    if (!req || !req.body || !req.body.clientId || !req.body.purchaseDate || !req.body.paymentMethod || !req.body.totalAmount) {
      throw new Error('Requisição inválida');
    }
    
    const { clientId, purchaseDate, paymentMethod, totalAmount } = req.body;
    
    // Validação de tipos de dados
    if (typeof clientId !== 'string' || typeof purchaseDate !== 'string' || typeof paymentMethod !== 'string' || typeof totalAmount !== 'number') {
      throw new Error('Tipo de dado inválido');
    }

    const purchaseDateParsed = new Date(purchaseDate);
    if (isNaN(purchaseDateParsed.getTime())) {
      throw new Error('Formato de data inválido');
    }

    const deliveryDateParsed = new Date(req.body.deliveryDate);
    if (req.body.deliveryDate && isNaN(deliveryDateParsed.getTime())) {
      throw new Error('Formato de data de entrega inválido');
    }
  },

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
      deliveryDate, // Novo campo
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
      if (deliveryDate !== undefined) updateFields.deliveryDate = new Date(deliveryDate); // Novo campo
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
