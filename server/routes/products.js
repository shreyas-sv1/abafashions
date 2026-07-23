const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { verifyJWT } = require('../middleware/auth');
const { uploadToCloudinary, deleteFromCloudinary } = require('../lib/cloudinary');

const router = express.Router();
const prisma = new PrismaClient();

// Use memory storage so we can stream directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ─── GET /api/products ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    console.error('[Products/List]', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('[Products/Get]', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ─── POST /api/products ───────────────────────────────────────────────────────
router.post('/', verifyJWT, upload.single('image'), async (req, res) => {
  try {
    const { name, price, originalPrice, category, inStock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    let imageUrl = '';
    let publicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.url;
      publicId = result.public_id;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ error: 'Image is required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category: category || 'Sarees',
        imageUrl,
        publicId,
        inStock: inStock !== 'false' && inStock !== false,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('[Products/Create]', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
router.put('/:id', verifyJWT, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const { name, price, originalPrice, category, inStock } = req.body;
    let imageUrl = existing.imageUrl;
    let publicId = existing.publicId;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      await deleteFromCloudinary(existing.publicId);
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.url;
      publicId = result.public_id;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name || existing.name,
        price: price ? parseFloat(price) : existing.price,
        originalPrice: originalPrice !== undefined
          ? (originalPrice ? parseFloat(originalPrice) : null)
          : existing.originalPrice,
        category: category || existing.category || 'Sarees',
        imageUrl,
        publicId,
        inStock: inStock !== undefined
          ? (inStock !== 'false' && inStock !== false)
          : existing.inStock,
      },
    });

    res.json(product);
  } catch (err) {
    console.error('[Products/Update]', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    // Delete from Cloudinary first
    await deleteFromCloudinary(existing.publicId);

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('[Products/Delete]', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
