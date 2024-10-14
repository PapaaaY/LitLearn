import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const StoryAnalysisScreen = () => {
  const [analysis, setAnalysis] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitInfo, setRateLimitInfo] = useState(null); // Store rate limit details

  const navigation = useNavigation(); // Get navigation object

  const handleSubmit = async () => {
    if (!analysis.trim()) {
      alert('Please enter a valid text for analysis');
      return;
    }

    setIsLoading(true);
    setError('');
    let success = false;
    const maxRetries = 5;
    let retryCount = 0;

    while (retryCount < maxRetries && !success) {
      try {
        const result = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Analyze the following text for literary devices: ${analysis}` }],
          temperature: 0.7,
        }, {
          headers: {
            'Authorization': `Bearer `, // Replace with your actual OpenAI API key
            'Content-Type': 'application/json',
          },
        });

        // Log rate limit information
        const rateLimit = {
          limit: result.headers['x-ratelimit-limit-requests'],
          remaining: result.headers['x-ratelimit-remaining-requests'],
          reset: result.headers['x-ratelimit-reset-requests'],
        };
        console.log('Rate Limit:', rateLimit);

        // Set rate limit info state
        setRateLimitInfo(rateLimit);

        setResponse(result.data.choices[0].message.content);
        success = true;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          retryCount++;
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.warn(`Rate limit exceeded. Retrying in ${waitTime / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          console.error('Error analyzing text:', error);
          setError('There was an issue with analyzing the text. Please try again.');
          break;
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Story Analysis</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowTextInput(true)}>
        <Text style={styles.buttonText}>Enter Text</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PredefinedStories')}>
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
          <Button title="Submit Analysis" onPress={handleSubmit} disabled={isLoading} />
        </>
      )}
      {isLoading && <ActivityIndicator size="large" color="#fff" />}
      {response && (
        <Text style={styles.responseText}>{response}</Text>
      )}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {rateLimitInfo && (
        <View style={styles.rateLimitContainer}>
          <Text style={styles.rateLimitText}>Rate Limit: {rateLimitInfo.limit}</Text>
          <Text style={styles.rateLimitText}>Remaining Requests: {rateLimitInfo.remaining}</Text>
          <Text style={styles.rateLimitText}>Reset Time (in seconds): {rateLimitInfo.reset}</Text>
        </View>
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
  errorText: {
    color: 'red',
    marginTop: 20,
  },
  rateLimitContainer: {
    marginTop: 20,
  },
  rateLimitText: {
    color: '#fff',
  },
});

export default StoryAnalysisScreen;