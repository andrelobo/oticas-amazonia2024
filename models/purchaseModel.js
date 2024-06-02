const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new mongoose.Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  details: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: false,
    
  },
  purchaseStatus: {
    type: Boolean,
    required: false,
    default: false  // Define o padrão como não pago
  }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;