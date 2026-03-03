import express from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, authUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post(
    '/',
    [
        body('name', 'Name is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    validate,
    registerUser
);

router.post(
    '/login',
    [
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists(),
    ],
    validate,
    authUser
);

router.route('/profile').get(protect, getUserProfile);

export default router;
