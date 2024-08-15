// src/screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>LitLearn</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.helperText}>If you have an account, Login here</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <Text style={styles.helperText}>If you don't have an account, Sign up here</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // light grey
  },
  banner: {
    width: '100%',
    backgroundColor: '#333', // dark grey
    height: '50%', // cover half of the page
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 48,
    color: '#fff', // white
    fontWeight: 'bold',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#333', // dark grey
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff', // white
    fontSize: 18,
  },
  helperText: {
    fontSize: 16,
    color: '#666', // grey
    marginBottom: 10,
  },
});

export default WelcomeScreen;