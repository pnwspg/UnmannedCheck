const express = require('express');
const router = express.Router();
const Substation = require('../models/Substation');
const { auth } = require('../middleware/auth');

// Helper mapping regionCode -> regionName
const regionMap = {
  n1: 'กฟน.1', n2: 'กฟน.2', n3: 'กฟน.3',
  ne1: 'กฟฉ.1', ne2: 'กฟฉ.2', ne3: 'กฟฉ.3',
  c1: 'กฟก.1', c2: 'กฟก.2', c3: 'กฟก.3',
  s1: 'กฟต.1', s2: 'กฟต.2', s3: 'กฟต.3',
};

// GET /api/substations  (Admin = ทุกเขต, User = เขตตัวเอง)
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.regionCode = req.user.region;
    }
    const data = await Substation.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/substations  (สร้างของเขตที่ตัวเองเป็น)
router.post('/', auth, async (req, res) => {
  try {
    const user = req.user;

    const regionCode = user.role === 'admin'
      ? (req.body.regionCode || user.region) // Admin จะเลือกเขตเองก็ได้
      : user.region; // user ปกติ = เขตตัวเองเท่านั้น

    const regionName = regionMap[regionCode];

    const newSub = await Substation.create({
      ...req.body,
      regionCode,
      regionName
    });

    res.status(201).json(newSub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/substations/:id (แก้เฉพาะของเขตตัวเอง ถ้าไม่ใช่ admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const sub = await Substation.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Not found' });

    if (req.user.role !== 'admin' && sub.regionCode !== req.user.region) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(sub, req.body);
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/substations/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const sub = await Substation.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Not found' });

    if (req.user.role !== 'admin' && sub.regionCode !== req.user.region) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await sub.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
