import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchExercisesByUnit } from '../services/api';

const UnitExerciseScreen = ({ route, navigation }) => {
  const { unitId } = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesData = await fetchExercisesByUnit(unitId);
        console.log('Fetched Exercises:', exercisesData); // Debugging log

        // Filter unique exercises by exercise_number
        const uniqueExercises = exercisesData.filter((exercise, index, self) =>
          index === self.findIndex((e) => e.exercise_number === exercise.exercise_number)
        );

        setExercises(uniqueExercises);
      } catch (error) {
        setError('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [unitId]);

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
      <Text style={styles.title}>Exercises</Text>
      <FlatList
        data={exercises}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseItem}
            onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })}
          >
            <Text style={styles.exerciseText}>Exercise {item.exercise_number}</Text>
          </TouchableOpacity>
        )}
      />
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
  exerciseItem: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  exerciseText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UnitExerciseScreen;