const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'litlearn_user',
  password: 'Panama15!',
  database: 'litlearn'
});

const cors = require('cors');
app.use(cors());

app.use(express.json());

(async () => {
  try {
    await connection.execute('SELECT 1');
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Database connection failed:', err.stack);
  }
})();

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    const user = jwt.verify(token, secretKey);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

app.post('/api/users/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [resultSet] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (resultSet.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [insertResult] = await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [resultSet] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (resultSet.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = resultSet[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, userId: user.id });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Fetch Lessons Endpoint (Protected)
app.get('/api/lessons', authenticateToken, async (req, res) => {
  try {
    const [results] = await connection.execute('SELECT * FROM lessons');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching lessons:', err);
    res.status(500).json({ error: 'Error fetching lessons' });
  }
});

// Add or Update Lesson Endpoint (Protected)
app.post('/api/lessons', authenticateToken, async (req, res) => {
  const { id, title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    if (id) {
      // Update lesson
      await connection.execute('UPDATE lessons SET title = ?, content = ? WHERE id = ?', [title, content, id]);
      res.status(200).json({ message: 'Lesson updated successfully' });
    } else {
      // Add new lesson
      await connection.execute('INSERT INTO lessons (title, content) VALUES (?, ?)', [title, content]);
      res.status(201).json({ message: 'Lesson added successfully' });
    }
  } catch (err) {
    console.error('Error adding/updating lesson:', err);
    res.status(500).json({ error: 'Error adding/updating lesson' });
  }
});

// Exercise Endpoint (Protected)
app.post('/api/exercises', authenticateToken, async (req, res) => {
  const { lessonId, exercise } = req.body;

  try {
    await connection.execute('INSERT INTO exercises (lesson_id, exercise) VALUES (?, ?)', [lessonId, exercise]);
    res.status(201).json({ message: 'Exercise added successfully' });
  } catch (err) {
    console.error('Error adding exercise:', err);
    res.status(500).json({ error: 'Error adding exercise' });
  }
});

// Progress Tracking Endpoint (Protected)
app.get('/api/progress/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const [results] = await connection.execute('SELECT * FROM progress WHERE user_id = ?', [userId]);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Error fetching progress' });
  }
});

app.post('/api/users/logout', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error logging out:', err);
    res.status(500).json({ error: 'Error logging out' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
