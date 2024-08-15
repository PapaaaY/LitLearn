// src/components/ProgressTracker.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';  // Install this library if not already

const ProgressTracker = ({ streak }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Streak</Text>
      <ProgressBar progress={streak / 100} width={200} />
      <Text style={styles.streakText}>{streak} days</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  streakText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ProgressTracker;
