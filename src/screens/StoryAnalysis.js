import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const StoryAnalysisScreen = () => {
  const [analysis, setAnalysis] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const result = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: `Analyze the following text for literary devices: ${analysis}`,
        max_tokens: 150,
      }, {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
          'Content-Type': 'application/json',
        },
      });
      setResponse(result.data.choices[0].text);
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Story Analysis</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowTextInput(true)}>
        <Text style={styles.buttonText}>Enter Text</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { /* Handle predefined story */ }}>
        <Text style={styles.buttonText}>Predefined Story</Text>
      </TouchableOpacity>
      {showTextInput && (
        <>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your analysis here"
            multiline
            value={analysis}
            onChangeText={setAnalysis}
          />
          <Button title="Submit Analysis" onPress={handleSubmit} />
        </>
      )}
      {response && (
        <Text style={styles.responseText}>{response}</Text>
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
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    color: '#fff',
  },
  responseText: {
    marginTop: 20,
    color: '#fff',
  },
});

export default StoryAnalysisScreen;