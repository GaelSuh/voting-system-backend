const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  votes: {
    type: Object,
    required: true,
    // Structure: { "categoryName": { "month": "selectedColleagueName" } }
    // Example: { 
    //   "Employee of the Year": { "Sept": "Samuel", "Oct": "Elvis", "Nov": "Cecilia" },
    //   "Team Spirit & Collaboration": { "Sept": "Favour", "Oct": "Gael", "Nov": "Love" },
    //   "Innovation & Initiative": { "Sept": "Eugene", "Oct": "Steph", "Nov": "Partemus" }
    // }
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isAnonymous: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
voteSchema.index({ userName: 1, submittedAt: -1 });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;