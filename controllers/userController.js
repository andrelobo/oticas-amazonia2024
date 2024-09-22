const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { generateAccessToken } = require('../utils/authUtils');
const EmailService = require('../service/emailService');
const bcrypt = require('bcrypt');

const userController = {
  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *             required:
   *               - username
   *               - email
   *               - password
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 user:
   *                   type: object
   *       400:
   *         description: All fields are required
   *       500:
   *         description: Internal server error
   */
  async createUser(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new userModel({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();

      await EmailService.sendWelcomeEmail(email, username);

      res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: User login
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Internal server error
   */
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userModel.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await user.isValidPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const accessToken = generateAccessToken(user);
      

      res.status(200).json({ accessToken });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Retrieve a user by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the user
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A single user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *       400:
   *         description: User ID is required
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async getUserById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const foundUser = await userModel.findById(id);
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user: foundUser });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Retrieve all users
   *     responses:
   *       200:
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *       500:
   *         description: Internal server error
   */
  async getAllUsers(req, res) {
    try {
      const users = await userModel.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Update a user by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the user
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *       400:
   *         description: User ID is required
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async updateUserById(req, res) {
    const { id: userId } = req.params;
    const { username, email, password } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const updatedUser = await userModel.findByIdAndUpdate(userId, { username, email, password }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The ID of the user
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       400:
   *         description: User ID is required
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async deleteUserById(req, res) {
    const { id: userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const deletedUser = await userModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = userController;
