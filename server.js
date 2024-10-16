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
  database: 'litlearn',
  charset: 'utf8mb4',
});

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

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

    const userId = insertResult.insertId;
    const token = jwt.sign({ id: userId, username }, secretKey, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token, userId });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Attempting login for username: ${username}`);
    const [resultSet] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (resultSet.length === 0) {
      console.log('No user found with the provided username');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = resultSet[0];
    console.log(`User found: ${JSON.stringify(user)}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password comparison result: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log('Password comparison failed');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    console.log(`Login successful for username: ${username}, token generated: ${token}`);
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
// Fetch Exercises by Unit ID Endpoint (Protected)

app.get('/api/exercises', authenticateToken, async (req, res) => {
  const { unitId } = req.query;

  try {
    const [results] = await connection.execute(`
      SELECT exercises.*, units.title AS unit_title
      FROM exercises
      JOIN units ON exercises.unit_id = units.id
      WHERE exercises.unit_id = ?
    `, [unitId]);
    console.log('Exercises fetched:', results); // Debugging log
    res.json(results);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ error: 'Error fetching exercises' });
  }
});

// Fetch Exercise by ID Endpoint (Protected)
app.get('/api/exercises/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await connection.execute('SELECT * FROM exercises WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching exercise:', err);
    res.status(500).json({ error: 'Error fetching exercise' });
  }
});

// Validate Exercise Answer Endpoint (Protected)
app.post('/api/exercises/:id/validate', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { answer, lessonId } = req.body; // Assuming lessonId is passed in the request body
  const userId = req.user.id;

  try {
    const [exerciseResult] = await connection.execute('SELECT * FROM exercises WHERE id = ?', [id]);
    if (exerciseResult.length === 0) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const isCorrect = exerciseResult[0].correct_answer === answer;
    const today = new Date().toISOString().split('T')[0];

    // Ensure lessonId is not undefined
    const lessonIdValue = lessonId !== undefined ? lessonId : null;

    // Set default progress value
    const progressValue = 0;

    // Update progress table
    await connection.execute(
      'INSERT INTO progress (user_id, completed_date, exercise_id, lesson_id, progress) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE exercise_id = ?',
      [userId, today, id, lessonIdValue, progressValue, id]
    );

    // Update streak table
    const [streakResult] = await connection.execute('SELECT * FROM streak WHERE user_id = ?', [userId]);
    if (streakResult.length === 0) {
      await connection.execute('INSERT INTO streak (user_id, streak_count, last_completed) VALUES (?, 1, ?)', [userId, today]);
    } else {
      const lastCompleted = new Date(streakResult[0].last_completed);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastCompleted.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        await connection.execute('UPDATE streak SET streak_count = streak_count + 1, last_completed = ? WHERE user_id = ?', [today, userId]);
      } else if (lastCompleted.toISOString().split('T')[0] !== today) {
        await connection.execute('UPDATE streak SET streak_count = 1, last_completed = ? WHERE user_id = ?', [today, userId]);
      }
    }

    res.json({ isCorrect, message: isCorrect ? 'Correct answer!' : 'Incorrect answer.' });
  } catch (err) {
    console.error('Failed to validate answer:', err);
    res.status(500).json({ message: 'Failed to validate answer' });
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

app.post('/api/users/logout', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('No token provided');
    return res.sendStatus(403);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.sendStatus(403);
    }
    // Handle logout logic here
    console.log('Logout successful for user:', user);
    res.sendStatus(200);
  });
});

// Get Lesson by ID Endpoint (Protected)
app.get('/api/lessons/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await connection.execute('SELECT * FROM lessons WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error retrieving lesson:', err);
    res.status(500).json({ error: 'Error retrieving lesson' });
  }
});

app.post('/api/users/change-credentials', authenticateToken, async (req, res) => {
  const { username, password } = req.body;
  const userId = req.user.id;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, hashedPassword, userId]);
    res.status(200).json({ message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Error updating credentials:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch Units Endpoint (Protected)
// server.js
app.get('/api/units', authenticateToken, async (req, res) => {
  try {
    const [results] = await connection.execute('SELECT * FROM units');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching units:', err);
    res.status(500).json({ error: 'Error fetching units' });
  }
});
// Add this endpoint to server.js

app.get('/api/stories', authenticateToken, async (req, res) => {
  try {
    const [results] = await connection.execute('SELECT * FROM story_analysis');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching stories:', err);
    res.status(500).json({ error: 'Error fetching stories' });
  }
});

app.get('/api/stories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await connection.execute('SELECT * FROM story_analysis WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching story by ID:', err);
    res.status(500).json({ error: 'Error fetching story by ID' });
  }
});

// Fetch current streak
app.get('/api/streak', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [streakResult] = await connection.execute('SELECT streak_count FROM streak WHERE user_id = ?', [userId]);
    if (streakResult.length === 0) {
      return res.json({ streak: 0 });
    }
    res.json({ streak: streakResult[0].streak_count });
  } catch (err) {
    console.error('Failed to fetch streak:', err);
    res.status(500).json({ message: 'Failed to fetch streak' });
  }
});

// Fetch progress data
app.get('/api/progress', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [progressResult] = await connection.execute('SELECT completed_date, COUNT(*) as exercises_completed FROM progress WHERE user_id = ? GROUP BY completed_date', [userId]);
    res.json(progressResult);
  } catch (err) {
    console.error('Failed to fetch progress:', err);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://192.168.100.133:${port}`);
});
