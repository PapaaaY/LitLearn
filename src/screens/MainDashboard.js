import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../services/api';

const MainDashboardScreen = ({ navigation }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
        setIsLoggedIn(!!storedToken);
      } catch (error) {
        console.error('Error retrieving token:', error);
      } finally {
        setLoading(false);
      }
    };

    retrieveToken();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      setToken(null);
      setIsLoggedIn(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LitLearn!</Text>
      <Text style={styles.subtitle}>Your journey to knowledge begins here.</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Start Learning</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Progress')}>
        <Text style={styles.buttonText}>View Progress</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Help')}>
        <Text style={styles.buttonText}>Help</Text>
      </TouchableOpacity>
      
      {isLoggedIn && token ? (
        <View>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangeCredentials')}>
            <Text style={styles.buttonText}>Change Password/Username</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',  // Dark grey background
    padding: 20,  // Add padding to the container
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',  // Dark grey background
  },
  loadingText: {
    color: '#fff',  // White text color
    fontSize: 18,
  },
  title: {
    fontSize: 28,  // Increase font size for better visibility
    fontWeight: 'bold',
    color: '#fff',  // White color for the title
    textAlign: 'center',
    marginBottom: 10,  // Margin to separate title from other elements
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',  // Light grey color for subtitles
    textAlign: 'center',
    marginBottom: 30,  // Margin to separate subtitle from other elements
  },
  button: {
    backgroundColor: '#444',  // Slightly lighter grey for buttons
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,  // Rounded corners
    marginBottom: 15,  // Margin to separate buttons from each other
    width: '80%',  // Make buttons take up 80% of the container width
    alignItems: 'center',
    shadowColor: '#000',  // Black shadow
    shadowOffset: { width: 0, height: 2 },  // Shadow offset
    shadowOpacity: 0.8,  // Shadow opacity
    shadowRadius: 5,  // Shadow radius
    elevation: 5,  // Elevation for Android shadow
  },
  logoutButton: {
    backgroundColor: '#FF4C4C',  // Red color for the logout button
  },
  buttonText: {
    color: '#fff',  // White color for button text
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#555',  // Medium grey for input fields
    color: '#fff',  // White text color for input fields
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,  // Margin to separate input fields from other elements
    width: '80%',  // Make input fields take up 80% of the container width
  },
});

export default MainDashboardScreen;