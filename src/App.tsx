import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Animated,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InstructionsScreen from './InstructionsScreen';
import LinearGradient from 'react-native-linear-gradient';

const backgroundImage = require('../assets/images/redchair.jpg');
const googleLogo = require('../assets/images/google_logo.jpg');

// Main Screen (FilmFeast) Component
function FilmFeast({ navigation }: any): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Fade-in animation for the title
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
        style={styles.overlay}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.content}>
          <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
            FilmFeast
          </Animated.Text>

          {/* Get Started with Google Button */}
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <Image source={googleLogo} style={styles.googleLogo} />
            <Text style={styles.googleButtonText}>Get Started with Google</Text>
          </TouchableOpacity>

          {/* How It Works Button */}
          <TouchableOpacity onPress={() => navigation.navigate('Instructions')} style={styles.howItWorksButton}>
            <Text style={styles.howItWorksText}>How It Works?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={FilmFeast} />
        <Stack.Screen name="Instructions" component={InstructionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#ffcc00',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  howItWorksButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'transparent',
  },
  howItWorksText: {
    fontSize: 18,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default App;
