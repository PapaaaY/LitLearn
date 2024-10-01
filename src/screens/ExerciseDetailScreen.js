import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchExerciseById, validateExerciseAnswer } from '../services/api';

const ExerciseDetailScreen = ({ route }) => {
  const { exerciseId } = route.params;
  const [exercise, setExercise] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const exerciseData = await fetchExerciseById(exerciseId);
        console.log('Fetched Exercise:', exerciseData); // Debugging log
        setExercise(exerciseData);
      } catch (error) {
        setError('Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  const handleSubmit = async () => {
    if (selectedOption === null) {
      setError('Please select an option');
      return;
    }

    try {
      const response = await validateExerciseAnswer(exerciseId, selectedOption);
      setResult(response);
    } catch (error) {
      setError('Failed to validate answer');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Loading...</Text>
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
      <Text style={styles.title}>Exercise {exercise.exercise_number}</Text>
      <Text style={styles.questionText}>{exercise.question}</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => setSelectedOption('A')}
      >
        <Text style={styles.optionText}>{exercise.option_a}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => setSelectedOption('B')}
      >
        <Text style={styles.optionText}>{exercise.option_b}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => setSelectedOption('C')}
      >
        <Text style={styles.optionText}>{exercise.option_c}</Text>
      </TouchableOpacity>
      <Button title="Submit" onPress={handleSubmit} />
      {result && (
        <Text style={styles.resultText}>{result.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
  resultText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseDetailScreen;