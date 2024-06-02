const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const EmailService = {
  // Função para enviar e-mails de boas-vindas
  async sendWelcomeEmail(userEmail, userName) {
    if (!userEmail || !userName) {
      throw new Error('userEmail e userName são parâmetros necessários');
    }

    try {
      const msg = {
        to: userEmail,
        from: 'xonga73@gmail.com', // substitua pelo seu e-mail verificado no SendGrid
        subject: 'Bem-vindo ao Zoe Fashion Store App - Seu aplicativo de gerenciamento de loja!',
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
                  line-height: 1.6;
                  background-color: #ffe4e1;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  border: 2px solid #ff69b4;
                  border-radius: 10px;
                  background-color: #fff;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #ff69b4; /* Hot Pink */
                  text-align: center;
                }
                p {
                  color: #333; /* Black */
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #ff69b4; /* Hot Pink */
                  color: #fff; /* White */
                  text-decoration: none;
                  border-radius: 5px;
                  text-align: center;
                  margin: 20px auto;
                  display: block;
                  font-size: 16px;
                  font-weight: bold;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #666;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Bem-vinda ao Zoe Fashion Store!</h1>
                <p>Olá ${userName},</p>
                <p>Parabéns por se cadastrar no Zoe Fashion Store! Estamos super animados para tê-la como parte da nossa comunidade fashionista.</p>
                <p>O Zoe Fashion Store é o seu aplicativo de gerenciamento de loja, onde você pode controlar estoque, pedidos, e muito mais.</p>
                <p>Clique no botão abaixo para fazer login e começar a usar o Zoe Fashion Store agora mesmo:</p>
                <a href="http://localhost:7777/login" class="button">Fazer Login</a>
                <p>Se precisar de ajuda ou tiver alguma dúvida, não hesite em nos contatar.</p>
                <p>Com carinho,<br>Equipe do Zoe Fashion Store</p>
                <div class="footer">
                  <p>Zoe Fashion Store - Seu Gerenciamento de Loja Simplificado</p>
                </div>
              </div>
            </body>
          </html>
        `
      };
      

      await sgMail.send(msg);
      console.log('Email de boas-vindas enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar o e-mail de boas-vindas:', error);
      throw error;
    }
  },

  // Função para enviar e-mails de redefinição de senha
  async sendPasswordResetEmail(userEmail, resetToken) {
    if (!userEmail || !resetToken) {
      throw new Error('userEmail e resetToken são parâmetros necessários');
    }

    try {
      const msg = {
        to: userEmail,
        from: 'xonga73@gmail.com', // substitua pelo seu e-mail verificado no SendGrid
        subject: 'Redefinição de senha',
        text: `Olá,\n\nVocê solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:\n\nhttp://localhost:7777/reset-password?token=${resetToken}\n\nSe você não solicitou esta redefinição, ignore este e-mail.\n\nAtenciosamente,\nEquipe do Baravá`
      };

      await sgMail.send(msg);
      console.log('Email de redefinição de senha enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar o e-mail de redefinição de senha:', error);
      throw error;
    }
  }
};

module.exports = EmailService;
