import { Request, Response } from 'express';
import pool from '../../db/config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      sort = 'created_at'
    } = req.query as ProductQuery;

    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        pi.url as primary_image,
        COALESCE(AVG(pr.rating), 0) as average_rating,
        COUNT(DISTINCT pr.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN product_reviews pr ON p.id = pr.product_id
      WHERE p.is_active = true
    `;

    const queryParams: any[] = [];

    if (category) {
      query += ' AND c.slug = ?';
      queryParams.push(category);
    }

    if (minPrice) {
      query += ' AND p.price >= ?';
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      query += ' AND p.price <= ?';
      queryParams.push(maxPrice);
    }

    query += ' GROUP BY p.id';

    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'rating':
        query += ' ORDER BY average_rating DESC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await pool.execute<RowDataPacket[]>(query, queryParams);

    // Get total count for pagination
    const [countResult] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(DISTINCT p.id) as total FROM products p WHERE p.is_active = true',
      []
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      products: rows,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: total,
        items_per_page: limit
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        s.company_name as supplier_name,
        COALESCE(AVG(pr.rating), 0) as average_rating,
        COUNT(DISTINCT pr.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id
      WHERE p.id = ? AND p.is_active = true
      GROUP BY p.id
    `;

    const [product] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (!product[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get product images
    const [images] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC',
      [id]
    );

    // Get product reviews
    const [reviews] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        pr.*,
        u.full_name as reviewer_name
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = ?
      ORDER BY pr.created_at DESC
      LIMIT 10
    `, [id]);

    res.json({
      ...product[0],
      images,
      reviews
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      sku,
      quantity,
      images
    } = req.body;

    const supplier_id = req.user.supplier_id; // From JWT auth middleware

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert product
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO products (
          supplier_id, category_id, name, slug, description, 
          price, sku, quantity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          supplier_id,
          category_id,
          name,
          name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          price,
          sku,
          quantity
        ]
      );

      const productId = result.insertId;

      // Insert product images
      if (images && images.length > 0) {
        const imageValues = images.map((url: string, index: number) => [
          productId,
          url,
          index === 0 // First image is primary
        ]);

        await connection.query(
          'INSERT INTO product_images (product_id, url, is_primary) VALUES ?',
          [imageValues]
        );
      }

      await connection.commit();

      res.status(201).json({
        id: productId,
        message: 'Product created successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category_id,
      sku,
      quantity,
      images
    } = req.body;

    const supplier_id = req.user.supplier_id;

    // Verify product belongs to supplier
    const [product] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM products WHERE id = ? AND supplier_id = ?',
      [id, supplier_id]
    );

    if (!product[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Update product
      await connection.execute(
        `UPDATE products SET
          name = ?,
          slug = ?,
          description = ?,
          price = ?,
          category_id = ?,
          sku = ?,
          quantity = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          name,
          name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          price,
          category_id,
          sku,
          quantity,
          id
        ]
      );

      // Update images if provided
      if (images && images.length > 0) {
        // Delete existing images
        await connection.execute(
          'DELETE FROM product_images WHERE product_id = ?',
          [id]
        );

        // Insert new images
        const imageValues = images.map((url: string, index: number) => [
          id,
          url,
          index === 0
        ]);

        await connection.query(
          'INSERT INTO product_images (product_id, url, is_primary) VALUES ?',
          [imageValues]
        );
      }

      await connection.commit();

      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier_id = req.user.supplier_id;

    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM products WHERE id = ? AND supplier_id = ?',
      [id, supplier_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const offset = ((page as number) - 1) * (limit as number);

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        pi.url as primary_image,
        COALESCE(AVG(pr.rating), 0) as average_rating,
        COUNT(DISTINCT pr.id) as review_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN product_reviews pr ON p.id = pr.product_id
      WHERE c.slug = ? AND p.is_active = true
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      slug,
      limit,
      offset
    ]);

    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT p.id) as total 
       FROM products p 
       JOIN categories c ON p.category_id = c.id 
       WHERE c.slug = ? AND p.is_active = true`,
      [slug]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / (limit as number));

    res.json({
      products: rows,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: total,
        items_per_page: limit
      }
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    const offset = ((page as number) - 1) * (limit as number);

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = `%${q}%`;

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        pi.url as primary_image,
        COALESCE(AVG(pr.rating), 0) as average_rating,
        COUNT(DISTINCT pr.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN product_reviews pr ON p.id = pr.product_id
      WHERE (
        p.name LIKE ? OR
        p.description LIKE ? OR
        c.name LIKE ?
      ) AND p.is_active = true
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      searchTerm,
      searchTerm,
      searchTerm,
      limit,
      offset
    ]);

    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT p.id) as total 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?) 
       AND p.is_active = true`,
      [searchTerm, searchTerm, searchTerm]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / (limit as number));

    res.json({
      products: rows,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: total,
        items_per_page: limit
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};