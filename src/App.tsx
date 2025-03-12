// @ts-nocheck

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Alert
} from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Button, Text } from '@ui-kitten/components';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, signInWithCredential, GoogleAuthProvider } from '@react-native-firebase/auth';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

// Screens
import SwipingScreen from './SwipingScreen';
import InstructionsScreen from './InstructionsScreen';
import Dashboard from './Dashboard';
import ResultsScreen from './ResultsScreen';

// Import images
const backgroundImage = require('../assets/images/redchair.jpg');
const googleLogo = require('../assets/images/google_logo.jpg');

// Sign In Function
async function onGoogleButtonPress(navigation) {
  const auth = getAuth();

  try {
    await GoogleSignin.signOut();
    await auth.signOut();
  } catch (error) {
    console.log('Sign out error:', error);
  }

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken || signInResult.idToken;

    if (!idToken) throw new Error('No ID token found');

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, googleCredential);

    console.log('User signed in:', userCredential.user);
    Alert.alert('Sign In Successful', `Welcome, ${userCredential.user.displayName || 'User'}!`);
    navigation.navigate('Dashboard');
  } catch (error) {
    console.log('Google Sign-In Error:', error);
    Alert.alert('Sign In Failed', 'An error occurred while signing in. Please try again.');
  }
}

// Main Screen Component
function FilmFeast({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Accessory component to display the Google logo inside the Button
  const GoogleLogo = () => (
    <Image source={googleLogo} style={styles.googleLogo} />
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient 
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']} 
        style={styles.overlay} 
      />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* No Layout component - directly using SafeAreaView and Animated components */}
        <Animated.View 
          style={[
            styles.contentContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Animated.Text style={styles.title}>
            FilmFeast
          </Animated.Text>
          
          <Button
            style={styles.googleButton}
            status="control"
            accessoryLeft={GoogleLogo}
            onPress={() => onGoogleButtonPress(navigation)}
          >
            Get Started with Google
          </Button>
          
          <Button
            style={styles.howItWorksButton}
            appearance="ghost"
            status="basic"
            onPress={() => navigation.navigate('Instructions')}
          >
            How It Works?
          </Button>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Stack Navigator
const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
  }, []);

  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={FilmFeast} />
          <Stack.Screen name="Instructions" component={InstructionsScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="SwipingScreen" component={SwipingScreen} />
          <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 60,
    color: '#ffcc00',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  googleButton: {
    borderRadius: 30,
    width: '100%',
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  howItWorksButton: {
    marginTop: 15,
    borderColor: 'transparent',
  },
});

export default App;