// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.100.96:3001/api'; // Replace with your IP address

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

    await AsyncStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Fetch all lessons
export const fetchLessons = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/lessons`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

// Fetch exercises based on the lesson ID
export const fetchExercises = async (lessonId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/exercises`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { lessonId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/users/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await AsyncStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Submit story analysis for a specific exercise
export const submitStoryAnalysis = async (exerciseId, analysis) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/story-analysis`,
      { exerciseId, analysis },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting story analysis:', error);
    throw error;
  }
};
