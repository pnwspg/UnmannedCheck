const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  // region สำหรับ user 12 เขต: n1,n2,...,s3
  region: { 
    type: String, 
    enum: ['n1','n2','n3','ne1','ne2','ne3','c1','c2','c3','s1','s2','s3'],
    required: function () { return this.role === 'user'; }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
