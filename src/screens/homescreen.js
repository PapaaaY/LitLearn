import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Welcome to LitLearn!</Text>
      <Button title="Go to Lessons" onPress={() => navigation.navigate('Lesson')} />
      <Button title="Go to Exercises" onPress={() => navigation.navigate('Exercise')} />
      <Button title="Go to Story Analysis" onPress={() => navigation.navigate('StoryAnalysis')} />
      <Button title="Go to Progress Tracker" onPress={() => navigation.navigate('Progress')} />
    </View>
  );
}
