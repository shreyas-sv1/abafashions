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
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.url;
        publicId = result.public_id;
      } catch (cloudErr) {
        console.warn('[Cloudinary Warning] Falling back to Data URL:', cloudErr.message);
        imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';
    }

    const createData = {
      name,
      price: parseFloat(price),
      imageUrl,
      publicId,
      inStock: inStock !== 'false' && inStock !== false,
    };
    if (originalPrice) createData.originalPrice = parseFloat(originalPrice);
    if (category) createData.category = category;

    let product;
    try {
      product = await prisma.product.create({ data: createData });
    } catch (createErr) {
      if (createErr.message && createErr.message.includes('Unknown argument')) {
        console.warn('[Prisma Warning] Schema field missing in client, creating without extended fields:', createErr.message);
        const basicData = {
          name,
          price: parseFloat(price),
          imageUrl,
          publicId,
          inStock: inStock !== 'false' && inStock !== false,
        };
        product = await prisma.product.create({ data: basicData });
        // Attach fields in response so client UI gets originalPrice and category
        product.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
        product.category = category || 'Sarees';
      } else {
        throw createErr;
      }
    }

    res.status(201).json(product);
  } catch (err) {
    console.error('[Products/Create]', err);
    res.status(500).json({ error: err.message || 'Failed to create product' });
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
      try {
        if (existing.publicId) await deleteFromCloudinary(existing.publicId);
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.url;
        publicId = result.public_id;
      } catch (cloudErr) {
        console.warn('[Cloudinary Warning] Falling back to Data URL:', cloudErr.message);
        imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const updateData = {
      name: name || existing.name,
      price: price ? parseFloat(price) : existing.price,
      imageUrl,
      publicId,
      inStock: inStock !== undefined
        ? (inStock !== 'false' && inStock !== false)
        : existing.inStock,
    };
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (category !== undefined) updateData.category = category;

    let product;
    try {
      product = await prisma.product.update({
        where: { id },
        data: updateData,
      });
    } catch (updateErr) {
      if (updateErr.message && updateErr.message.includes('Unknown argument')) {
        console.warn('[Prisma Warning] Schema field missing in client, updating basic fields:', updateErr.message);
        delete updateData.originalPrice;
        delete updateData.category;
        product = await prisma.product.update({
          where: { id },
          data: updateData,
        });
        product.originalPrice = originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : existing.originalPrice;
        product.category = category || existing.category || 'Sarees';
      } else {
        throw updateErr;
      }
    }

    res.json(product);

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
