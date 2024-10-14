import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HelpScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} color="#00ff00" />
      <Text style={styles.title}>Help & Guidance</Text>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.content}>
          Welcome to LitLearn! Here are some features and guidance on how to use the program effectively:
        </Text>
        <Text style={styles.featureTitle}>Feature 1: Lessons</Text>
        <Text style={styles.featureDescription}>
          Access a variety of lessons to enhance your learning experience. Navigate to the Lessons screen to get started.
        </Text>
        <Text style={styles.featureTitle}>Feature 2: Exercises</Text>
        <Text style={styles.featureDescription}>
          Test your knowledge with exercises. Each lesson comes with a set of exercises to help you practice.
        </Text>
        <Text style={styles.featureTitle}>Feature 3: Progress Tracker</Text>
        <Text style={styles.featureDescription}>
          Track your learning progress over time. The Progress Tracker provides insights into your learning streaks and completed exercises.
        </Text>
        <Text style={styles.featureTitle}>Feature 4: Story Analysis</Text>
        <Text style={styles.featureDescription}>
          Analyze predefined stories or your own text for literary devices. Use the Story Analysis feature to deepen your understanding of literature.
        </Text>
        <Text style={styles.featureTitle}>Feature 5: Account Management</Text>
        <Text style={styles.featureDescription}>
          Manage your account settings, including changing your username and password, from the Main Dashboard.
        </Text>
        <Text style={styles.featureTitle}>Need More Help?</Text>
        <Text style={styles.featureDescription}>
          If you need further assistance, please contact our support team at support@litlearn.com.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333', // Dark grey background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // White text
    marginBottom: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    color: '#fff', // White text
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ff00', // Green text for feature titles
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 16,
    color: '#fff', // White text
    marginBottom: 20,
  },
});

export default HelpScreen;