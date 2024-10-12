import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleLogin = async () => {
    console.log(`Logging in with username: ${username} and password: ${password}`);
    try {
      const response = await axios.post('http://192.168.100.133:3001/api/users/login', { username, password });
      const { token, userId } = response.data;
      console.log(`Logged in successfully! Token: ${token}, UserId: ${userId}`);
      await AsyncStorage.setItem('token', token); // Store the token in AsyncStorage
      navigation.reset({ index: 0, routes: [{ name: 'MainDashboard' }] });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Invalid username or password');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Unexpected error: ${error.response.status}`);
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LitLearn</Text>
      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
  },
  button: {
    backgroundColor: '#666', // Dark grey button background
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // White button text
    fontSize: 18,
  },
});

export default LoginScreen;