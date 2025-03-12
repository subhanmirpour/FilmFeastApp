// @ts-nocheck
import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Layout, Text, Button, Card } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';

const InstructionsScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#1c1c1c', '#333']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <Text category="h1" style={styles.title}>🎬 Welcome to FilmFeast!</Text>
        <Text category="p1" style={styles.description}>
          Swipe, discover, and enjoy! FilmFeast helps you find the perfect movie and food pairing, whether you're solo or with friends.
        </Text>

        <Card style={styles.card}>
          <Text category="h5" style={styles.subtitle}>1️⃣ Get Started</Text>
          <Text category="p2">Sign up or log in to save your preferences and track recommendations.</Text>
        </Card>

        <Card style={styles.card}>
          <Text category="h5" style={styles.subtitle}>🎥 Single-Player Mode</Text>
          <Text category="p2">Swipe right 👍 to like, left 👎 to skip, up ⬆️ if you haven’t seen it.</Text>
          <Text category="p2">After 30 seconds, we’ll recommend a movie based on your choices.</Text>
          <Text category="p2">Then, swipe for food recommendations the same way!</Text>
        </Card>

        <Card style={styles.card}>
          <Text category="h5" style={styles.subtitle}>👥 Multiplayer Mode</Text>
          <Text category="p2">Create or join a group room with a unique code.</Text>
          <Text category="p2">Everyone swipes on the same movies for 30 seconds.</Text>
          <Text category="p2">The app finds the best match for the group.</Text>
          <Text category="p2">Repeat the process for food recommendations!</Text>
        </Card>

        <Card style={styles.card}>
          <Text category="h5" style={styles.subtitle}>🍿 Enjoy Your Night!</Text>
          <Text category="p2">Let FilmFeast handle the choices—sit back, relax, and enjoy your movie & meal! 🍔</Text>
        </Card>

        <Button style={styles.button} onPress={() => navigation.goBack()}>
          ← Back
        </Button>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = {
  title: {
    textAlign: 'center',
    color: '#ffcc00',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  description: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  card: {
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
    color: '#ff7e00',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ff7e00',
    borderRadius: 25,
  },
};

export default InstructionsScreen;
