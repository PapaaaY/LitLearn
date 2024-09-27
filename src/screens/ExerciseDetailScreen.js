import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchExerciseById, validateExerciseAnswer } from '../services/api';

const ExerciseDetailScreen = ({ route }) => {
  const { exerciseId } = route.params;
  const [exercise, setExercise] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const exerciseData = await fetchExerciseById(exerciseId);
        setExercise(exerciseData);
      } catch (error) {
        setError('Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  const handleInputChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await validateExerciseAnswer(exerciseId, answers);
      setResult(response);
    } catch (error) {
      setError('Failed to validate answers');
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
      {exercise.questions.map((question, index) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{index + 1}. {question.question}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your answer"
            value={answers[question.id] || ''}
            onChangeText={(value) => handleInputChange(question.id, value)}
          />
        </View>
      ))}
      <Button title="Submit" onPress={handleSubmit} />
      {result && (
        <Text style={styles.resultText}>Score: {result.score}</Text>
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
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#555',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
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