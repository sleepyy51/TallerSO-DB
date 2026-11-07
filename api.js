const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 8080;
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'biblioteca',
  user: process.env.DB_USER || 'biblioteca',
  password: process.env.DB_PASSWORD || 'biblioteca',
});

app.use(express.json());

const id = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const required = (body, fields) => fields.every((field) => body[field] !== undefined);

app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
});

app.get('/api/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
  res.json(rows);
});

app.get('/api/users/:id', async (req, res) => {
  const userId = id(req.params.id);
  if (!userId) return res.status(400).json({ error: 'Invalid id' });
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

app.post('/api/users', async (req, res) => {
  if (!required(req.body, ['name', 'email'])) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  const { name, email } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email],
  );
  res.status(201).json(rows[0]);
});

app.put('/api/users/:id', async (req, res) => {
  const userId = id(req.params.id);
  if (!userId || !required(req.body, ['name', 'email'])) {
    return res.status(400).json({ error: 'Valid id, name and email are required' });
  }
  const { name, email } = req.body;
  const { rows } = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, userId],
  );
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

app.delete('/api/users/:id', async (req, res) => {
  const userId = id(req.params.id);
  if (!userId) return res.status(400).json({ error: 'Invalid id' });
  const result = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
  if (!result.rowCount) return res.status(404).json({ error: 'User not found' });
  res.status(204).send();
});

app.get('/api/authors', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM authors ORDER BY id');
  res.json(rows);
});

app.get('/api/authors/:id', async (req, res) => {
  const authorId = id(req.params.id);
  if (!authorId) return res.status(400).json({ error: 'Invalid id' });
  const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [authorId]);
  if (!rows[0]) return res.status(404).json({ error: 'Author not found' });
  res.json(rows[0]);
});

app.post('/api/authors', async (req, res) => {
  if (!required(req.body, ['name'])) return res.status(400).json({ error: 'name is required' });
  const { rows } = await pool.query('INSERT INTO authors (name) VALUES ($1) RETURNING *', [req.body.name]);
  res.status(201).json(rows[0]);
});

app.put('/api/authors/:id', async (req, res) => {
  const authorId = id(req.params.id);
  if (!authorId || !required(req.body, ['name'])) {
    return res.status(400).json({ error: 'Valid id and name are required' });
  }
  const { rows } = await pool.query(
    'UPDATE authors SET name = $1 WHERE id = $2 RETURNING *',
    [req.body.name, authorId],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Author not found' });
  res.json(rows[0]);
});

app.delete('/api/authors/:id', async (req, res) => {
  const authorId = id(req.params.id);
  if (!authorId) return res.status(400).json({ error: 'Invalid id' });
  const result = await pool.query('DELETE FROM authors WHERE id = $1', [authorId]);
  if (!result.rowCount) return res.status(404).json({ error: 'Author not found' });
  res.status(204).send();
});

app.get('/api/books', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM books ORDER BY id');
  res.json(rows);
});

app.get('/api/books/:id', async (req, res) => {
  const bookId = id(req.params.id);
  if (!bookId) return res.status(400).json({ error: 'Invalid id' });
  const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
  if (!rows[0]) return res.status(404).json({ error: 'Book not found' });
  res.json(rows[0]);
});

app.post('/api/books', async (req, res) => {
  if (!required(req.body, ['title', 'isbn', 'author_id'])) {
    return res.status(400).json({ error: 'title, isbn and author_id are required' });
  }
  const { title, isbn, published_year, author_id } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO books (title, isbn, published_year, author_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, isbn, published_year ?? null, author_id],
  );
  res.status(201).json(rows[0]);
});

app.put('/api/books/:id', async (req, res) => {
  const bookId = id(req.params.id);
  if (!bookId || !required(req.body, ['title', 'isbn', 'author_id'])) {
    return res.status(400).json({ error: 'Valid id, title, isbn and author_id are required' });
  }
  const { title, isbn, published_year, author_id } = req.body;
  const { rows } = await pool.query(
    `UPDATE books SET title = $1, isbn = $2, published_year = $3, author_id = $4
     WHERE id = $5 RETURNING *`,
    [title, isbn, published_year ?? null, author_id, bookId],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Book not found' });
  res.json(rows[0]);
});

app.delete('/api/books/:id', async (req, res) => {
  const bookId = id(req.params.id);
  if (!bookId) return res.status(400).json({ error: 'Invalid id' });
  const result = await pool.query('DELETE FROM books WHERE id = $1', [bookId]);
  if (!result.rowCount) return res.status(404).json({ error: 'Book not found' });
  res.status(204).send();
});

app.get('/api/loans', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM loans ORDER BY id');
  res.json(rows);
});

app.get('/api/loans/:id', async (req, res) => {
  const loanId = id(req.params.id);
  if (!loanId) return res.status(400).json({ error: 'Invalid id' });
  const { rows } = await pool.query('SELECT * FROM loans WHERE id = $1', [loanId]);
  if (!rows[0]) return res.status(404).json({ error: 'Loan not found' });
  res.json(rows[0]);
});

app.post('/api/loans', async (req, res) => {
  if (!required(req.body, ['user_id', 'book_id', 'borrowed_at'])) {
    return res.status(400).json({ error: 'user_id, book_id and borrowed_at are required' });
  }
  const { user_id, book_id, borrowed_at, returned_at } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO loans (user_id, book_id, borrowed_at, returned_at)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, book_id, borrowed_at, returned_at ?? null],
  );
  res.status(201).json(rows[0]);
});

app.put('/api/loans/:id', async (req, res) => {
  const loanId = id(req.params.id);
  if (!loanId || !required(req.body, ['user_id', 'book_id', 'borrowed_at'])) {
    return res.status(400).json({ error: 'Valid id, user_id, book_id and borrowed_at are required' });
  }
  const { user_id, book_id, borrowed_at, returned_at } = req.body;
  const { rows } = await pool.query(
    `UPDATE loans SET user_id = $1, book_id = $2, borrowed_at = $3, returned_at = $4
     WHERE id = $5 RETURNING *`,
    [user_id, book_id, borrowed_at, returned_at ?? null, loanId],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Loan not found' });
  res.json(rows[0]);
});

app.delete('/api/loans/:id', async (req, res) => {
  const loanId = id(req.params.id);
  if (!loanId) return res.status(400).json({ error: 'Invalid id' });
  const result = await pool.query('DELETE FROM loans WHERE id = $1', [loanId]);
  if (!result.rowCount) return res.status(404).json({ error: 'Loan not found' });
  res.status(204).send();
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`API running at http://localhost:${port}`));
}

module.exports = { app, pool };
