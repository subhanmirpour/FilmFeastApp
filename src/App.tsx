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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const backgroundImage = require('../assets/images/popcorn.jpg');

// Login Screen Component
function LoginScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Login Screen</Text>
      <Text style={{ fontSize: 18 }}>Welcome! This is the login screen.</Text>
    </View>
  );
}

// Main Screen (FilmFeast) Component
function FilmFeast({ navigation }: any): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.content}>
          <Text style={styles.title}>FilmFeast</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')} // Navigate to Login screen
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.signUpButton]}>
            <Text style={styles.buttonText}>Sign Up</Text>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#ffcc00',
  },
  button: {
    backgroundColor: '#ff6600',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: '#0080ff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
});

export default App;
