// src/screens/ExerciseScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const ExerciseScreen = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Fetch exercises for the selected lesson
    axios.get(`http://localhost:3001/api/exercises?lessonId=${lessonId}`)
      .then(response => setExercises(response.data))
      .catch(error => console.error(error));
  }, [lessonId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercises</Text>
      {exercises.map(exercise => (
        <View key={exercise.id} style={styles.exerciseItem}>
          <Text>{exercise.description}</Text>
          <Button title="Analyze Story" onPress={() => navigation.navigate('StoryAnalysis', { exerciseId: exercise.id })} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  exerciseItem: {
    marginBottom: 10,
  },
});

export default ExerciseScreen;
