import { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainDashboard = ({ navigation }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      console.log('Token retrieved from AsyncStorage:', token);
      if (token) {
        setToken(token);
        setIsLoggedIn(true);
      } else {
        setToken(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = useCallback(async () => {
    if (!token) {
      console.error('Token is null, cannot logout');
      return;
    }
    setIsLoggedIn(false); // <--- Add this line
    try {
      const response = await axios.post('http://192.168.100.96:3001/api/users/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Logout response:', response);
      if (response.status === 200) {
        AsyncStorage.removeItem('token');
        navigation.navigate('Welcome');
      } else {
        console.error('Error logging out:', response.status);
        setIsLoggedIn(true); // <--- Add this line to revert the state if logout fails
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
      console.error('Error response:', error.response);
      console.error('Error config:', error.config);
      setIsLoggedIn(true); // <--- Add this line to revert the state if logout fails
    }
  }, [token, navigation]);

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LitLearn!</Text>
      <Button title="Start Learning" onPress={() => navigation.navigate('Lessons')} />
      <Button title="View Progress" onPress={() => navigation.navigate('Progress')} />
      {isLoggedIn && token ? (
        <Button title="Logout" onPress={handleLogout} color="#FF0000" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White text
    textAlign: 'center',
  },
});

export default MainDashboard;