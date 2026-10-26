import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages, togglePinMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, sendMessage);
router.put('/:id/pin', protect, togglePinMessage);

export default router;
