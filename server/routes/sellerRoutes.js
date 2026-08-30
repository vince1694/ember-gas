import express from 'express';
import Seller from '../models/Seller.js';

const router = express.Router();

// GET /api/sellers/live-map — Fetch all sellers with inventory & coordinates
router.get('/live-map', async (req, res) => {
  try {
    const sellers = await Seller.find({});
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/sellers/register — Register new seller application
router.post('/register', async (req, res) => {
  try {
    const { name, sellerType, locationName, address, phone } = req.body;
    const seller = new Seller({
      name,
      sellerType,
      locationName,
      address,
      phone,
      isVerified: false,
      inventory: [
        { size: '6kg', availableCount: 20, pricePerKg: 1300, status: 'AVAILABLE' },
        { size: '12.5kg', availableCount: 40, pricePerKg: 1450, status: 'AVAILABLE' },
        { size: '25kg', availableCount: 10, pricePerKg: 2800, status: 'AVAILABLE' },
        { size: '50kg', availableCount: 5, pricePerKg: 5500, status: 'AVAILABLE' }
      ]
    });
    const createdSeller = await seller.save();
    res.status(201).json(createdSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/sellers/:id/inventory — Update stock & pricing
router.put('/:id/inventory', async (req, res) => {
  try {
    const { inventory } = req.body;
    const seller = await Seller.findById(req.params.id);
    if (seller) {
      seller.inventory = inventory;
      const updatedSeller = await seller.save();
      res.json(updatedSeller);
    } else {
      res.status(404).json({ message: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
