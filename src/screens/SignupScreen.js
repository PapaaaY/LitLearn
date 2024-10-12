import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const createUser = async (userData) => {
    try {
      const response = await axios.post('http://192.168.100.133:3001/api/users/signup', userData);
      const { token, userId } = response.data;

      if (!token) {
        throw new Error('Token not received');
      }

      await AsyncStorage.setItem('token', token); // Store the token in AsyncStorage
      console.log(`Signed up successfully! Token: ${token}, UserId: ${userId}`);
      return true;
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : error.message);
      return false;
    }
  };

  const handleSignup = async () => {
    console.log('Signup button clicked!');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const success = await createUser({ username, password });
      if (success) {
        console.log(`Signed up successfully!`);
        // Navigate to MainDashboardScreen after successful signup
        navigation.reset({ index: 0, routes: [{ name: 'MainDashboard' }] });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LitLearn</Text>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry={true}
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        style={styles.input}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Dark grey background
  },
  header: {
    fontSize: 100,
    fontWeight: 'bold',
    marginTop: -50,
    color: '#fff', // White text
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff', // White text
  },
  input: {
    height: 40,
    borderColor: '#666', // Dark grey border
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: '#fff', // White input background
    marginBottom: 10, // Add margin bottom to separate inputs
    width: '80%', // Make input fields take up 80% of the container width
  },
  button: {
    backgroundColor: '#666', // Dark grey button background
    padding: 10,
    borderRadius: 5,
    marginBottom: 10, // Add margin bottom to separate button from error message
  },
  buttonText: {
    color: '#fff', // White button text
    fontSize: 18,
  },
});

export default SignupScreen;