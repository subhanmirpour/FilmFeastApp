// @ts-nocheck
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

/**
 * Helper function to shuffle an array in place.
 */
function shuffleArray(arr: any[]): any[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SwipingScreen: React.FC = () => {
  // Get screen param (mode) from navigation route
  const route = useRoute();
  const { mode } = route.params as { mode: 'movie' | 'food' | 'both' };

  // State: items, current index, loading status
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Animation & references
  const pan = useRef(new Animated.ValueXY()).current;
  const swipeInProgress = useRef(false);
  const navigation = useNavigation();
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  /**
   * Fetch and set items (movies, food, or both) according to mode.
   */
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let fetchedItems: any[] = [];

      if (mode === 'movie') {
        const response = await tmdbApi.getPopularMovies();
        const moviesData = response.results || response;
        if (moviesData.length > 0) {
          fetchedItems = shuffleArray(moviesData);
        }
      } else if (mode === 'food') {
        fetchedItems = getRandomFoods();
      } else if (mode === 'both') {
        // Get movies
        let moviesItems: any[] = [];
        const response = await tmdbApi.getPopularMovies();
        const moviesData = response.results || response;
        if (moviesData.length > 0) {
          moviesItems = shuffleArray(moviesData);
        }
        // Get food
        const foodItems = getRandomFoods();
        fetchedItems = [...moviesItems, ...foodItems];
      }

      setItems(fetchedItems);
      setCurrentIndex(0);
      setLoading(false);
    };

    fetchItems();
  }, [mode]);

  /**
   * Reset pan position and swipe flag whenever currentIndex changes.
   */
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    swipeInProgress.current = false;
  }, [currentIndex]);

  /**
   * Set up swipe gestures with PanResponder.
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gestureState) => {
        if (swipeInProgress.current) return;

        let swipeDirection = null;
        if (gestureState.dx > 120) {
          swipeDirection = 'right';
        } else if (gestureState.dx < -120) {
          swipeDirection = 'left';
        } else if (gestureState.dy < -120) {
          swipeDirection = 'up';
        }

        if (swipeDirection) {
          swipeInProgress.current = true;
          Animated.timing(pan, {
            toValue: {
              x: swipeDirection === 'right' ? SCREEN_WIDTH : swipeDirection === 'left' ? -SCREEN_WIDTH : 0,
              y: swipeDirection === 'up' ? -SCREEN_WIDTH : 0
            },
            duration: 300,
            useNativeDriver: false
          }).start(() => {
            goToNextItem();
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  /**
   * Move to next item in array; if none remain, clear them out.
   */
  const goToNextItem = () => {
    pan.setValue({ x: 0, y: 0 });
    setCurrentIndex(prevIndex => {
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

  // Current card's data
  const currentItem = items[currentIndex];
  const imageSource = currentItem?.poster_path
    ? { uri: `https://image.tmdb.org/t/p/w500${currentItem.poster_path}` }
    : currentItem?.image;
  const titleText = currentItem?.title || currentItem?.name;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']} style={styles.overlay} />
      <SafeAreaView style={styles.container}>

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Screen title */}
        <Text style={styles.title}>Swipe to Choose</Text>

        {/* Main swipe area */}
        <View style={styles.swipeContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffcc00" />
          ) : items.length > 0 && currentIndex < items.length ? (
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
          )}
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
    alignItems: 'center'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  backButtonText: {
    fontSize: 18,
    color: '#ffcc00',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffcc00'
  },
  swipeContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.7,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffcc00',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden'
  },
  moviePoster: {
    width: '100%',
    height: 600,
    borderRadius: 20
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
    padding: 10
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00'
  }
});

export default SwipingScreen;
