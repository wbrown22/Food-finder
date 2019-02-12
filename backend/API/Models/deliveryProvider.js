const mongoose = require('mongoose');
const providerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Name field is required']
  },
  specialty: {
    type: String,
    required: [true, 'Specialty field is required']
  },
  orders: {
    type: Number,
    default: 0
  },
  open: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
});

module.exports = mongoose.model('Provider', providerSchema);
