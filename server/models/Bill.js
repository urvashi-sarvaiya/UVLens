const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  bill_type: String,
  provider_name: String,
  billing_period: String,
  due_date: String,
  total_amount: Number,
  line_items: [
    {
      label: String,
      amount: Number,
      plain_explanation: String
    }
  ],
  flags: [
    {
      item: String,
      reason: String
    }
  ],
  summary: String,
  ocrText: String,
  originalFileName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
