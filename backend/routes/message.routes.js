import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, sendMessage);

export default router;
