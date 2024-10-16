// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.100.133:3001/api'; // Replace with your IP address

// User Signup
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// User Login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    const { token } = response.data;
    console.log('Token received:', token);
    await AsyncStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// User Logout
export const logoutUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    console.log('Token:', token); // Debugging log

    const response = await axios.post(`${API_BASE_URL}/users/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Logout response:', response); // Debugging log

    await AsyncStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Fetch Lessons
export const fetchLessons = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/lessons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch lessons error:', error);
    throw error;
  }
};

export const fetchLessonDetail = async (lessonId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch lesson detail error:', error);
    throw error;
  }
};

// Fetch Units
// src/services/api.js
export const fetchUnits = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/units`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // No need to filter here as the database now only contains units with valid titles
  } catch (error) {
    console.error('Fetch units error:', error);
    throw error;
  }
};

// Fetch Exercises by Unit
// src/services/api.js
export const fetchExercisesByUnit = async (unitId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/exercises?unitId=${unitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch exercises error:', error);
    throw error;
  }
};

// Fetch Exercise by ID
export const fetchExerciseById = async (exerciseId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/exercises/${exerciseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch exercise error:', error);
    throw error;
  }
};

// Validate Exercise Answer
export const validateExerciseAnswer = async (exerciseId, answer, lessonId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/exercises/${exerciseId}/validate`, { answer, lessonId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Validate answer error:', error);
    throw error;
  }
};

// Fetch Predefined Stories
export const fetchPredefinedStories = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch predefined stories error:', error);
    throw error;
  }
};

// Fetch Story by ID
// Fetch Story by ID
export const fetchStoryById = async (storyId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Fetching story by ID:', storyId); // Debugging log
    const response = await axios.get(`${API_BASE_URL}/stories/${storyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Story fetched:', response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error('Fetch story by ID error:', error);
    throw error;
  }
};

// Fetch current streak
export const fetchStreak = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/streak`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.streak;
  } catch (error) {
    console.error('Fetch streak error:', error);
    throw error;
  }
};

// Fetch progress data
export const fetchProgress = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch progress error:', error);
    throw error;
  }
};