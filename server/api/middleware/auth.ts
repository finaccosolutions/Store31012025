import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../../db/config';
import { RowDataPacket } from 'mysql2';

interface JwtPayload {
  userId: string;
  role: string;
  supplier_id?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const isSupplier = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'supplier') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [supplier] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM suppliers WHERE user_id = ? AND verification_status = ?',
      [req.user.userId, 'verified']
    );

    if (!supplier[0]) {
      return res.status(403).json({ error: 'Supplier not verified' });
    }

    req.user.supplier_id = supplier[0].id;
    next();
  } catch (error) {
    console.error('Error checking supplier status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};