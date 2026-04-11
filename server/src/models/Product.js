const { pool } = require("../config/database");

const Product = {
  async findAll({ page = 1, limit = 12, category, minPrice, maxPrice, sort, featured }) {
    let query = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true";
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND c.slug = $${paramIndex++}`;
      params.push(category);
    }
    if (minPrice) {
      query += ` AND p.price >= $${paramIndex++}`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND p.price <= $${paramIndex++}`;
      params.push(maxPrice);
    }
    if (featured) {
      query += " AND p.featured = true";
    }

    // Count total before pagination
    const countQuery = query.replace("SELECT p.*, c.name as category_name", "SELECT COUNT(*)");
    const { rows: countRows } = await pool.query(countQuery, params);
    const total = parseInt(countRows[0].count);

    // Sorting
    const sortOptions = {
      newest: "p.created_at DESC",
      price_asc: "p.price ASC",
      price_desc: "p.price DESC",
      rating: "p.avg_rating DESC",
      popular: "p.num_reviews DESC",
    };
    query += ` ORDER BY ${sortOptions[sort] || sortOptions.newest}`;

    // Pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return { products: rows, total };
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    return rows[0];
  },

  async findBySlug(slug) {
    const { rows } = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    );
    return rows[0];
  },

  async search(term, { page = 1, limit = 12 }) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT p.*, c.name as category_name,
              ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), plainto_tsquery($1)) AS rank
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true AND to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery($1)
       ORDER BY rank DESC LIMIT $2 OFFSET $3`,
      [term, limit, offset]
    );
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM products WHERE is_active = true AND to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery($1)`,
      [term]
    );
    return { products: rows, total: parseInt(countRows[0].count) };
  },

  async create(data) {
    const { rows } = await pool.query(
      `INSERT INTO products (name, slug, description, price, compare_price, stock, images, category_id, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [data.name, data.slug, data.description, data.price, data.compare_price, data.stock, data.images || [], data.category_id, data.featured || false]
    );
    return rows[0];
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const { rows } = await pool.query(
      `UPDATE products SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query("UPDATE products SET is_active = false WHERE id = $1", [id]);
  },
};

module.exports = Product;
