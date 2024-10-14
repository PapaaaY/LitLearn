import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchStreak, fetchProgress } from '../services/api';
import { LineChart, Grid } from 'react-native-svg-charts';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProgressScreen = ({ userId }) => {
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const streakData = await fetchStreak();
        const progressData = await fetchProgress();
        setStreak(streakData);
        setProgress(progressData);
      } catch (error) {
        console.error('Failed to load progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const data = progress.map(entry => entry.exercises_completed);
  const dates = progress.map(entry => entry.completed_date);

  const markedDates = progress.reduce((acc, entry) => {
    acc[entry.completed_date] = {
      marked: true,
      dotColor: entry.exercises_completed > 0 ? 'red' : 'blue',
      customStyles: {
        container: {
          backgroundColor: entry.exercises_completed > 0 ? 'red' : 'blue',
        },
        text: {
          color: 'white',
        },
      },
    };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Progress</Text>
      <Text style={styles.streak}>Current Streak: {streak} days</Text>
      <View style={styles.graphContainer}>
        <LineChart
          style={styles.chart}
          data={data}
          svg={{ stroke: 'rgb(134, 65, 244)' }}
          contentInset={{ top: 20, bottom: 20 }}
        >
          <Grid />
        </LineChart>
        <Calendar
          markedDates={markedDates}
          markingType={'custom'}
          renderArrow={(direction) => (
            <MaterialCommunityIcons
              name={`chevron-${direction}`}
              size={24}
              color="black"
            />
          )}
        />
      </View>
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
  streak: {
    fontSize: 18,
    color: '#00ff00',
    marginBottom: 20,
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chart: {
    height: 200,
    width: '50%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#000',
    marginTop: 10,
  },
});

export default ProgressScreen;