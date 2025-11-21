// seed.js (รันครั้งเดียว)
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const regions = ['n1','n2','n3','ne1','ne2','ne3','c1','c2','c3','s1','s2','s3'];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const password = await bcrypt.hash('123456', 10);

    // Admin
    await User.create({
      username: 'admin',
      passwordHash: password,
      role: 'admin'
    });

    // 12 Users
    for (const r of regions) {
      await User.create({
        username: r,        // เช่น n1
        passwordHash: password,
        role: 'user',
        region: r
      });
    }

    console.log('Seed completed');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
