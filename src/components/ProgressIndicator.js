// src/components/ProgressIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const ProgressIndicator = ({ progress }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Progress: {Math.round(progress * 100)}%</Text>
    <ProgressBar progress={progress} color="#007bff" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProgressIndicator;
