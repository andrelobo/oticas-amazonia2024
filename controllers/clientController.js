const Client = require('../models/clientModel');
const Purchase = require('../models/purchaseModel');

const ClientController = {
  /**
   * @swagger
   * /api/clients:
   *   post:
   *     summary: Cria um novo cliente
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       201:
   *         description: Cliente criado com sucesso
   *       400:
   *         description: Nome e e-mail são obrigatórios ou e-mail já registrado
   *       500:
   *         description: Erro interno do servidor
   */
  async createClient(req, res) {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const newClient = new Client({ name, email, phone });
      await newClient.save();

      res.status(201).json({ client: newClient });
    } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /api/clients/{id}:
   *   get:
   *     summary: Obtém um cliente pelo ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do cliente
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Cliente encontrado
   *       400:
   *         description: ID do cliente é obrigatório
   *       404:
   *         description: Cliente não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async getClientById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Client ID is required' });
      }

      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.status(200).json({ client });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /api/clients:
   *   get:
   *     summary: Obtém todos os clientes
   *     responses:
   *       200:
   *         description: Lista de clientes
   *       500:
   *         description: Erro interno do servidor
   */
  async getAllClients(req, res) {
    try {
      console.log('Endpoint getAllClients accessed');
      const clients = await Client.find();
      res.status(200).json({ clients });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /api/clients/{id}:
   *   put:
   *     summary: Atualiza um cliente pelo ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do cliente
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       200:
   *         description: Cliente atualizado
   *       400:
   *         description: ID do cliente é obrigatório
   *       404:
   *         description: Cliente não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async updateClientById(req, res) {
    try {
      const { id: clientId } = req.params;
      const { name, email, phone } = req.body;
      if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required' });
      }

      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        { name, email, phone },
        { new: true }
      );
      if (!updatedClient) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.status(200).json({ client: updatedClient });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /api/clients/{id}:
   *   delete:
   *     summary: Deleta um cliente pelo ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do cliente
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Cliente deletado com sucesso
   *       400:
   *         description: ID do cliente é obrigatório
   *       404:
   *         description: Cliente não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async deleteClientById(req, res) {
    try {
      const { id: clientId } = req.params;
      if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required' });
      }

      const deletedClient = await Client.findByIdAndDelete(clientId);
      if (!deletedClient) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /api/clients/{id}/purchases:
   *   get:
   *     summary: Obtém um cliente e suas compras
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do cliente
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Cliente e suas compras encontrados
   *       400:
   *         description: ID do cliente é obrigatório
   *       404:
   *         description: Cliente não encontrado ou nenhuma compra encontrada
   *       500:
   *         description: Erro interno do servidor
   */
  async getClientWithPurchases(req, res) {
    try {
      const clientId = req.params.id;
      if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required' });
      }

      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      const purchases = await Purchase.find({ client: clientId });
      if (!purchases) {
        return res.status(404).json({ message: 'No purchases found for this client' });
      }

      res.json({
        client,
        purchases
      });
    } catch (error) {
      console.error('Error getting client and purchases:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = ClientController;
