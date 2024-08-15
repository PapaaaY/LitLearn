// src/screens/StoryAnalysisScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const StoryAnalysisScreen = ({ route }) => {
  const { exerciseId } = route.params;
  const [analysis, setAnalysis] = useState('');

  const handleSubmit = () => {
    // Submit story analysis
    console.log(`Exercise ID: ${exerciseId}, Analysis: ${analysis}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Story Analysis</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your analysis here"
        multiline
        value={analysis}
        onChangeText={setAnalysis}
      />
      <Button title="Submit Analysis" onPress={handleSubmit} />
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
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default StoryAnalysisScreen;
