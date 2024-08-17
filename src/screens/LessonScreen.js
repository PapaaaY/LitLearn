import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import LessonCard from '../components/LessonCard';
import { fetchLessons } from '../services/api';

const LessonScreen = ({ navigation }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const lessonsData = await fetchLessons();
        setLessons(lessonsData);
      } catch (error) {
        setError('Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

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
      <Text style={styles.title}>Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <LessonCard
            title={`Unit ${item.id}: ${item.title}`}
            onPress={() => navigation.navigate('LessonDetail', { lessonId: item.id })}
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
    backgroundColor: '#333',  // Dark grey background
  },
  title: {
    fontSize: 28,  // Increase font size for better visibility
    fontWeight: 'bold',
    color: '#fff',  // White color for the title
    marginBottom: 20,  // Margin to separate title from other elements
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',  // White color for the loading text
    marginTop: 10,  // Margin to separate loading text from indicator
  },
  errorText: {
    color: '#ff4d4d',  // Red color for error text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LessonScreen;
