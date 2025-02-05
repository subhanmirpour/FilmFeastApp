// App.tsx

import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen'; // Import the LoginScreen component
import SignupScreen from './SignupScreen';

const backgroundImage = require('../assets/images/redchair.jpg');

// Main Screen (FilmFeast) Component
function FilmFeast({ navigation }: any): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.content}>
          <Text style={styles.title}>FilmFeast</Text>

          {/* Login Button with Gradient */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
            <LinearGradient colors={['#ff7e00', '#ff5500']} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Button with Gradient */}
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.8}>
            <LinearGradient colors={['#007bff', '#0056b3']} style={[styles.button, styles.signUpButton]}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Set up the Stack Navigator
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={FilmFeast} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles used in the FilmFeast component
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'orange',
    textShadowColor: 'rgba(0, 0, 0, 0.7)', // Shadow for better readability
    textShadowOffset: { width: 15, height: 10 },
    textShadowRadius: 15,
  },
  button: {
    width: 250,
    paddingVertical: 15,
    borderRadius: 25, // More rounded edges for modern look
    alignItems: 'center',
    shadowColor: '#000', // Adds a slight shadow
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Elevation for Android
    marginBottom: 15,
  },
  signUpButton: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;
