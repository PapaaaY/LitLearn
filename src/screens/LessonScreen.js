// src/screens/LessonScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { fetchLessons } from '../services/api';
import ProgressTracker from '../components/ProgressTracker';
import LessonCard from '../components/LessonCard';

// Placeholder function for fetching user streak, replace with actual API call
const fetchUserStreak = async () => {
  try {
    // Replace with your actual API call to fetch user streak
    const response = await fetch('http://192.168.200.109:3001/api/user/streak', {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    return data.streak; // Adjust based on actual API response
  } catch (error) {
    console.error('Error fetching user streak:', error);
    throw error;
  }
};

const LessonScreen = ({ navigation }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(0); // Default streak value

  useEffect(() => {
    const loadLessonsAndStreak = async () => {
      try {
        // Fetch lessons
        const lessonsData = await fetchLessons();
        setLessons(lessonsData);

        // Fetch user streak
        const userStreak = await fetchUserStreak();
        setStreak(userStreak);
      } catch (error) {
        setError('Failed to fetch lessons or streak.');
      } finally {
        setLoading(false);
      }
    };

    loadLessonsAndStreak();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProgressTracker streak={streak} />
      <Text style={styles.title}>Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <LessonCard
            title={item.title}
            onPress={() => navigation.navigate('Exercises', { lessonId: item.id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default LessonScreen;
