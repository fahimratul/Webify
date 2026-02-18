import express from 'express';
import MarketplaceItem from '../models/MarketPlaceItem.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/marketplace/items - Fetch all published marketplace items
router.get('/items', async (req, res) => {
    try {
        const items = await MarketplaceItem.find({ published: true })
            .populate('owner', 'username profilePicture')
            .sort({ createdAt: -1 });

        const formattedItems = items.map(item => ({
            id: item._id.toString(),
            title: item.title,
            author: item.owner?.username || 'Unknown',
            rating: 4.8, // Default rating - can be extended with reviews later
            downloads: 0, // Can track actual downloads
            likes: 0, // Can add like/favorite functionality
            price: item.isPremium ? item.price.toString() : '0',
            type: item.isPremium ? 'paid' : 'free',
            category: item.category || 'webpage',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', // Default image
            html: item.html || '',
            css: item.css || '',
            description: item.description || ''
        }));

        res.json({ success: true, items: formattedItems });
    } catch (err) {
        console.error('Marketplace fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// POST /api/marketplace/items - Create/Upload marketplace item
router.post('/items', async (req, res) => {
    try {
        // require authentication via middleware in server.js (see mount step)
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Not authenticated' });

        const { title, description, category, isPremium, price, html, css } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const item = new MarketplaceItem({
            title,
            description,
            category,
            isPremium: !!isPremium,
            price: Number(price) || 0,
            html,
            css,
            owner: user._id,
            published: true
        });

        await item.save();
        res.json({ success: true, item });
    } catch (err) {
        console.error('Marketplace upload error:', err);
        res.status(500).json({ error: 'Failed to save item' });
    }
});

export default router;