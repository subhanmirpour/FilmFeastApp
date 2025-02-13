import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const InstructionsScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#1c1c1c', '#333']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎬 Welcome to FilmFeast!</Text>
        <Text style={styles.description}>
          Swipe, discover, and enjoy! FilmFeast helps you find the perfect movie and food pairing, whether you're solo or with friends.
        </Text>
        <View style={styles.section}>
          <Text style={styles.subtitle}>1️⃣ Get Started</Text>
          <Text style={styles.text}>Sign up or log in to save your preferences and track recommendations.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>🎥 Single-Player Mode</Text>
          <Text style={styles.text}>Swipe right 👍 to like, left 👎 to skip, up ⬆️ if you haven’t seen it.</Text>
          <Text style={styles.text}>After 30 seconds, we’ll recommend a movie based on your choices.</Text>
          <Text style={styles.text}>Then, swipe for food recommendations the same way!</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>👥 Multiplayer Mode</Text>
          <Text style={styles.text}>Create or join a group room with a unique code.</Text>
          <Text style={styles.text}>Everyone swipes on the same movies for 30 seconds.</Text>
          <Text style={styles.text}>The app finds the best match for the group.</Text>
          <Text style={styles.text}>Repeat the process for food recommendations!</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>🍿 Enjoy Your Night!</Text>
          <Text style={styles.text}>Let FilmFeast handle the choices—sit back, relax, and enjoy your movie & meal! 🍔</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffcc00',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff7e00',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ff7e00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default InstructionsScreen;
