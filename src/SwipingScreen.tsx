import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder, 
  Dimensions, 
  ImageBackground, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/redchair.jpg'); // Same background as other screens

const SwipingScreen: React.FC = () => {
  const [timer, setTimer] = useState(30);
  const [swipingStarted, setSwipingStarted] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation(); // Use React Navigation hook

  // Start the countdown when swiping begins
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (swipingStarted && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [swipingStarted, timer]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (!swipingStarted) {
          setSwipingStarted(true);
        }
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 120) {
          console.log('Swiped right');
        } else if (gestureState.dx < -120) {
          console.log('Swiped left');
        } else if (gestureState.dy < -120) {
          console.log('Swiped up');
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
        pan.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']} style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        
        {/* Go Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Swipe to Choose</Text>

        <View style={styles.swipeContainer}>
          <Animated.View
            style={[styles.card, pan.getLayout()]}
            {...panResponder.panHandlers}
          >
            <Text style={styles.placeholderText}>Swipe Me!</Text>
          </Animated.View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timer} seconds</Text>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
};

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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#ffcc00',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffcc00',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
  },
  swipeContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffcc00',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  timerContainer: {
    marginTop: 30,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
});

export default SwipingScreen;
