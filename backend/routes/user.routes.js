import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', protect, getUsersForSidebar);
router.put('/profile', protect, updateProfile);

export default router;
