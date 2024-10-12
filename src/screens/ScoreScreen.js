// src/screens/ScoreScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ScoreScreen = ({ route, navigation }) => {
  const { score } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Score</Text>
      <Text style={styles.scoreText}>{score} / 5</Text>
      <Button title="Back to Dashboard" onPress={() => navigation.navigate('MainDashboard')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
});

export default ScoreScreen;