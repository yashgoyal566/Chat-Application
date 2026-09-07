import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createGroup, getConversations } from '../controllers/group.controller.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.post('/', protect, createGroup);

export default router;
