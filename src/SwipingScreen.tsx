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
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import tmdbApi from '../services/tmdbApi';
import { getRandomFoods } from '../services/foodData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/redchair.jpg');

const SwipingScreen: React.FC = () => {
  // Retrieve mode from route params (mode can be 'movie', 'food', or 'both')
  const route = useRoute();
  const { mode } = route.params as { mode: 'movie' | 'food' | 'both' };

  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation();
  const swipeInProgress = useRef(false);
  const itemsRef = useRef(items);

  // Keep track of items state
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Fetch data (movies, food, or both) based on the selected mode
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let fetchedItems: any[] = [];
  
      if (mode === 'movie') {
        // Fetch and shuffle movies for "movie" mode
        const response = await tmdbApi.getPopularMovies();
        const moviesData = response.results || response;
        if (moviesData.length > 0) {
          for (let i = moviesData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [moviesData[i], moviesData[j]] = [moviesData[j], moviesData[i]];
          }
          fetchedItems = moviesData;
        }
        // Optionally shuffle the combined list if needed (here, it's already shuffled)
      } else if (mode === 'food') {
        // Use only the food items for "food" mode
        fetchedItems = getRandomFoods();
      } else if (mode === 'both') {
        // For "both" mode: fetch movies and food separately, then combine
        let moviesItems: any[] = [];
        const response = await tmdbApi.getPopularMovies();
        const moviesData = response.results || response;
        if (moviesData.length > 0) {
          // Shuffle movies list
          for (let i = moviesData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [moviesData[i], moviesData[j]] = [moviesData[j], moviesData[i]];
          }
          moviesItems = moviesData;
        }
        const foodItems = getRandomFoods(); // Already returns a shuffled list
        // Combine movies first, then food (no further shuffling)
        fetchedItems = [...moviesItems, ...foodItems];
      }
  
      setItems(fetchedItems);
      setCurrentIndex(0);
      setLoading(false);
    };
  
    fetchItems();
  }, [mode]);
  

  // Reset pan position, swipe flag, and timer on each new item
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    swipeInProgress.current = false;
    resetTimer();
  }, [currentIndex]);

  // Timer functions
  const startTimer = () => {
    if (timerActive) return;
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

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(30);
    setTimerActive(false);
  };

  // Swipe functionality
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
          swipeDirection = "right";
        } else if (gestureState.dx < -120) {
          swipeDirection = "left";
        } else if (gestureState.dy < -120) {
          swipeDirection = "up";
        }
        if (swipeDirection) {
          swipeInProgress.current = true;
          startTimer();
          Animated.timing(pan, {
            toValue: { 
              x: swipeDirection === "right" ? SCREEN_WIDTH : swipeDirection === "left" ? -SCREEN_WIDTH : 0, 
              y: swipeDirection === "up" ? -SCREEN_WIDTH : 0 
            },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            goToNextItem();
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

  // Move to next item (movie or food)
  const goToNextItem = () => {
    pan.setValue({ x: 0, y: 0 });
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex < itemsRef.current.length) {
        return newIndex;
      } else {
        setItems([]);
        return prevIndex;
      }
    });
    swipeInProgress.current = false;
  };

  // Determine the data for the current card (movie or food)
  const currentItem = items[currentIndex];
  const imageSource = currentItem?.poster_path 
    ? { uri: `https://image.tmdb.org/t/p/w500${currentItem.poster_path}` }
    : currentItem?.image;
  const titleText = currentItem?.title || currentItem?.name;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']} style={styles.overlay} />
      <SafeAreaView style={styles.container}>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Swipe to Choose</Text>

        <View style={styles.swipeContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffcc00" />
          ) : (
            items.length > 0 && currentIndex < items.length ? (
              <Animated.View
                key={currentIndex}
                style={[styles.card, pan.getLayout()]}
                {...panResponder.panHandlers}
              >
                <Image 
                  source={imageSource || { uri: 'https://via.placeholder.com/500x750?text=No+Image' }}
                  style={styles.moviePoster}
                />
                <Text style={styles.movieTitle}>{titleText}</Text>
              </Animated.View>
            ) : (
              <Text style={styles.placeholderText}>No more items available.</Text>
            )
          )}
        </View>

        {/* Timer Display */}
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
    height: SCREEN_WIDTH * 1.7,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffcc00',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  moviePoster: {
    width: '100%',
    height: 600,
    borderRadius: 20,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
    padding: 10,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
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
});

export default SwipingScreen;
