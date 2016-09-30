const mongoose = require('mongoose');

const statisticSchema = mongoose.Schema({
  chat_id: {
    type: String,
    required: true
  },
  used: {
    type: Number,
    required: true
  }
});

mongoose.model('Statistic', statisticSchema);
