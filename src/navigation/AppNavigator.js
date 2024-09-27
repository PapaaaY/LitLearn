import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/homescreen';
import LessonScreen from '../screens/LessonScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import UnitExerciseScreen from '../screens/UnitExerciseScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import StoryAnalysis from '../screens/StoryAnalysis';
import ProgressScreen from '../screens/ProgressScreen';
import MainDashboard from '../screens/MainDashboard';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import ChangeCredentialsScreen from '../screens/ChangeCredentialsScreen';
import HelpScreen from '../screens/HelpScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen'; // Adjust the path as necessary
const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token retrieved:', token);
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigation.navigate('MainDashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ onLogin: handleLogin }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ onLogin: handleLogin }} />
      <Stack.Screen name="MainDashboard" component={MainDashboard} options={{ headerShown: false }} />
      <Stack.Screen name="ChangeCredentials" component={ChangeCredentialsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={HelpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Lesson" component={LessonScreen} />
          <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
          <Stack.Screen name="Exercise" component={ExerciseScreen} />
          <Stack.Screen name="UnitExercise" component={UnitExerciseScreen} />
          <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
          <Stack.Screen name="StoryAnalysis" component={StoryAnalysis} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
        </>
      ) : null}
    </Stack.Navigator>
  );
}