import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../db/config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone } = req.body;

    // Check if user already exists
    const [existingUser] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser[0]) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (email, password_hash, full_name, phone, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, passwordHash, full_name, phone, 'customer']
    );

    const token = jwt.sign(
      { userId: result.insertId, role: 'customer' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        full_name,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerSupplier = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      company_name,
      business_email,
      business_phone,
      tax_id,
      business_address
    } = req.body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Check if user/business email already exists
      const [existingUser] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ? OR email = ?',
        [email, business_email]
      );

      if (existingUser[0]) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const [userResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO users (email, password_hash, full_name, phone, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [email, passwordHash, full_name, phone, 'supplier']
      );

      // Create supplier profile
      const [supplierResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO suppliers (
          user_id, company_name, business_email, business_phone,
          tax_id, business_address
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userResult.insertId,
          company_name,
          business_email,
          business_phone,
          tax_id,
          business_address
        ]
      );

      await connection.commit();

      const token = jwt.sign(
        {
          userId: userResult.insertId,
          role: 'supplier',
          supplier_id: supplierResult.insertId
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: userResult.insertId,
          email,
          full_name,
          role: 'supplier',
          supplier: {
            id: supplierResult.insertId,
            company_name,
            verification_status: 'pending'
          }
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error registering supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Get user with role
    const [users] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        u.id, u.email, u.password_hash, u.full_name, u.role,
        s.id as supplier_id, s.verification_status
      FROM users u
      LEFT JOIN suppliers s ON u.id = s.user_id
      WHERE u.email = ?`,
      [email]
    );

    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.execute(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    const tokenPayload: any = {
      userId: user.id,
      role: user.role
    };

    if (user.role === 'supplier') {
      tokenPayload.supplier_id = user.supplier_id;
    }

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const response: any = {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    };

    if (user.role === ' supplier') {
      response.user.supplier = {
        id: user.supplier_id,
        verification_status: user.verification_status
      };
    }

    res.json(response);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Since we're using JWT, we don't need to do anything server-side
  // The client should remove the token
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [users] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        u.id, u.email, u.full_name, u.phone, u.role,
        s.id as supplier_id, s.company_name, s.verification_status
      FROM users u
      LEFT JOIN suppliers s ON u.id = s.user_id
      WHERE u.id = ?`,
      [userId]
    );

    const user = users[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response: any = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role
    };

    if (user.role === 'supplier') {
      response.supplier = {
        id: user.supplier_id,
        company_name: user.company_name,
        verification_status: user.verification_status
      };
    }

    res.json(response);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { full_name, phone } = req.body;

    await pool.execute(
      'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
      [full_name, phone, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const [users] = await pool.execute<RowDataPacket[]>(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    const user = users[0];

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};