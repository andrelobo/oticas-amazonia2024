const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema para descrever a prescrição dos óculos (esférico, cilíndrico, eixo)
const prescricaoSchema = new Schema({
  esferico: { type: String, required: false },  // Valor esférico
  cilindrico: { type: String, required: false },  // Valor cilíndrico
  eixo: { type: String, required: false }  // Valor do eixo
});

const purchaseSchema = new mongoose.Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  endereco: {
    rua: { type: String, required: false },
    bairro: { type: String, required: false },
    cidade: { type: String, required: false }
  },
  cpf: {
    type: String,
    required: false
  },
  paymentMethod: {
    type: String,
    enum: ['Cartão', 'Boleto', 'Dinheiro', 'Transferência', 'Pix'],
    required: true
  },
  oculos: {
    longe: {
      od: prescricaoSchema,  // Olho direito para visão de longe (prescrição)
      oe: prescricaoSchema   // Olho esquerdo para visão de longe (prescrição)
    },
    perto: {
      od: prescricaoSchema,  // Olho direito para visão de perto (prescrição)
      oe: prescricaoSchema   // Olho esquerdo para visão de perto (prescrição)
    }
  },
  armacaoRF: {  
    type: String,
    required: false
  },
  lenteRF: {  
    type: String,
    required: false
  },
  outros: {
    type: String,
    required: false
  },
  totalAmount: {
    type: Number,
    required: true
  },
  sinal: {
    type: Number,
    required: false,
    default: 0
  },
  purchaseStatus: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
