// src/screens/ProgressScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUserProgress } from '../services/api';

const ProgressScreen = ({ userId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const userProgress = await getUserProgress(userId);
        setProgress(userProgress);
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      }
    };

    fetchProgress();
  }, [userId]);

  return (
    <View style={styles.container}>
      {progress ? (
        <>
          <Text style={styles.header}>Your Progress</Text>
          <Text>Lessons Completed: {progress.lessonsCompleted}</Text>
          <Text>Achievements: {progress.achievements.join(', ')}</Text>
        </>
      ) : (
        <Text>Loading progress...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProgressScreen;
