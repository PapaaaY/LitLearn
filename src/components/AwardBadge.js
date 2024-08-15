// src/components/AwardBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AwardBadge = ({ badgeName }) => (
  <View style={styles.badge}>
    <Text style={styles.text}>{badgeName}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AwardBadge;
