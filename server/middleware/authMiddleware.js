import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = expressAsyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

const vendor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'independent_seller' || req.user.role === 'filling_station' || req.user.role === 'seller')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as a vendor');
    }
};

// Flexible Role Gate Middleware
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, please login first');
        }
        if (!allowedRoles.includes(req.user.role) && req.user.role !== 'admin') {
            res.status(403);
            throw new Error(`Forbidden: Role '${req.user.role}' is not authorized to access this resource`);
        }
        next();
    };
};

export { protect, admin, vendor, authorizeRoles };
