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
import tmdbApi from '../services/tmdbApi';

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/redchair.jpg');

const SwipingScreen: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30); // ⏳ Timer state
  const [timerActive, setTimerActive] = useState(false); // Flag to start/stop timer
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Store timer reference
  const pan = useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation();
  const swipeInProgress = useRef(false);
  const moviesRef = useRef(movies);

  // ✅ Keep track of movies state
  useEffect(() => {
    moviesRef.current = movies;
  }, [movies]);

  // ✅ Fetch Movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const response = await tmdbApi.getPopularMovies();
      
      const moviesData = response.results || response;
      console.log("Fetched Movies:", moviesData);
  
      setMovies(moviesData);
  
      if (moviesData.length > 0) {
        const randomIndex = Math.floor(Math.random() * moviesData.length);
        setCurrentIndex(randomIndex);
      }
  
      setLoading(false);
    };
    fetchMovies();
  }, []);

  // ✅ Reset pan position, swipe flag, and restart timer on swipe
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    swipeInProgress.current = false;
    resetTimer(); // Reset timer when new movie appears
  }, [currentIndex]);

  // ✅ Function to start countdown timer when swiping begins
  const startTimer = () => {
    if (timerActive) return; // Prevent multiple timers
    setTimerActive(true);
    setTimer(30); // Reset to 30 seconds

    timerRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!); // Stop timer when it hits 0
          setTimerActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // ✅ Function to reset timer on swipe
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear existing timer
    }
    setTimer(30);
    setTimerActive(false);
  };

  // ✅ Swipe Functionality
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
          startTimer(); // ✅ Start timer on first swipe
      
          Animated.timing(pan, {
            toValue: { 
              x: swipeDirection === "right" ? SCREEN_WIDTH : swipeDirection === "left" ? -SCREEN_WIDTH : 0, 
              y: swipeDirection === "up" ? -SCREEN_WIDTH : 0 
            },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            goToNextMovie();
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

  // ✅ Move to Next Movie
  const goToNextMovie = () => {
    pan.setValue({ x: 0, y: 0 });
    
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex < moviesRef.current.length) {
        return newIndex;
      } else {
        setMovies([]);
        return prevIndex;
      }
    });

    swipeInProgress.current = false;
  };

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
            movies.length > 0 && currentIndex < movies.length ? (
              <Animated.View
                key={movies[currentIndex].id}
                style={[styles.card, pan.getLayout()]}
                {...panResponder.panHandlers}
              >
                <Image 
                  source={{ 
                    uri: movies[currentIndex].poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movies[currentIndex].poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }}
                  style={styles.moviePoster}
                />
                <Text style={styles.movieTitle}>{movies[currentIndex].title}</Text>
              </Animated.View>
            ) : (
              <Text style={styles.placeholderText}>No more movies available.</Text>
            )
          )}
        </View>

        {/* ✅ Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timer} seconds</Text>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
};

// Keep your existing styles

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
    width: SCREEN_WIDTH * 1,
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
