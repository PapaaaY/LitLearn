import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LitLearn!</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Lesson')}>
        <Text style={styles.buttonText}>Go to Lessons</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Exercise', { lessonId: 1 })}>
        <Text style={styles.buttonText}>Go to Exercises</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StoryAnalysis')}>
        <Text style={styles.buttonText}>Go to Story Analysis</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Progress')}>
        <Text style={styles.buttonText}>Go to Progress Tracker</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',  // Dark grey background
    padding: 20,  // Add padding to the container
  },
  title: {
    fontSize: 28,  // Increase font size for better visibility
    fontWeight: 'bold',
    color: '#fff',  // White color for the title
    textAlign: 'center',
    marginBottom: 30,  // Margin to separate title from buttons
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
  buttonText: {
    color: '#fff',  // White color for button text
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});