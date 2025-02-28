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
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { getRandomFoods } from '../services/foodData'; //   Import function to fetch food data

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/foodbackground.jpg'); //   Change background for food selection

const FoodSwipingScreen: React.FC = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation();
  const swipeInProgress = useRef(false);
  const foodsRef = useRef(foods);

  //   Keep track of foods state
  useEffect(() => {
    foodsRef.current = foods;
  }, [foods]);

  //   Fetch food data when the screen loads
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      const fetchedFoods = getRandomFoods(); //   Fetch random food items
      setFoods(fetchedFoods);
      setCurrentIndex(0);
      setLoading(false);
    };

    fetchFoods();
  }, []);

  //   Start the timer when the screen loads (DOES NOT RESET after each swipe)
  useEffect(() => {
    if (!timerActive) {  //   Ensure timer only starts once
      startTimer();
    }
  }, []);

  //   Timer function (Keeps running independently)
  const startTimer = () => {
    if (timerRef.current) return; //   Prevent multiple timers from starting

    setTimerActive(true);
    setTimer(30);

    timerRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  //   Swipe functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (swipeInProgress.current) return;
        let swipeDirection = null;
        if (gestureState.dx > 120) {
          swipeDirection = "right"; //   Swiped right (like)
        } else if (gestureState.dx < -120) {
          swipeDirection = "left"; //   Swiped left (dislike)
        } else if (gestureState.dy < -120) {
          swipeDirection = "up"; //   Swiped up (haven’t tried)
        }
        if (swipeDirection) {
          swipeInProgress.current = true;
          Animated.timing(pan, {
            toValue: {
              x: swipeDirection === "right" ? SCREEN_WIDTH : swipeDirection === "left" ? -SCREEN_WIDTH : 0,
              y: swipeDirection === "up" ? -SCREEN_WIDTH : 0
            },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            goToNextFood();
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  //   Move to the next food item
  const goToNextFood = () => {
    pan.setValue({ x: 0, y: 0 });
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex < foodsRef.current.length) {
        return newIndex;
      } else {
        setFoods([]); //   End of food list
        return prevIndex;
      }
    });
    swipeInProgress.current = false;
  };

  //   Get current food item details
  const currentFood = foods[currentIndex];
  const imageSource = currentFood?.image;
  const titleText = currentFood?.name;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']} style={styles.overlay} />
      <SafeAreaView style={styles.container}>

        {/*   Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Swipe to Choose Your Meal</Text>

        <View style={styles.swipeContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffcc00" />
          ) : (
            foods.length > 0 && currentIndex < foods.length ? (
              <Animated.View
                key={currentIndex}
                style={[styles.card, pan.getLayout()]}
                {...panResponder.panHandlers}
              >
                <Image
                  source={imageSource || { uri: 'https://via.placeholder.com/500x750?text=No+Image' }}
                  style={styles.foodImage}
                />
                <Text style={styles.foodTitle}>{titleText}</Text>
              </Animated.View>
            ) : (
              <Text style={styles.placeholderText}>No more food options available.</Text>
            )
          )}
        </View>

        {/*   Timer Display (Keeps running while swiping) */}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffcc00',
  },
  swipeContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffcc00',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodImage: {
    width: '100%',
    height: 400,
    borderRadius: 20,
  },
  foodTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
    padding: 10,
  },
  timerContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffcc00',
  },

  placeholderText: {  //   Add this to fix the error
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
    marginTop: 20,
  },

  card: {  //   Fix: Add this to remove the error
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#222', // Dark background for better contrast
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
});





export default FoodSwipingScreen;
