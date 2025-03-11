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

// 1) Import modular Firebase functions
import { initializeApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc } from '@react-native-firebase/firestore';

import tmdbApi from '../services/tmdbApi';
import { getRandomFoods } from '../services/foodData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/redchair.jpg');

// With google-services.json in place, you do not need a firebaseConfig.
// React Native Firebase auto-initializes using your native config.
// However, if needed, you can initialize the app like this:
const app = initializeApp();
const db = getFirestore(app);

// Utility function to shuffle an array
function shuffleArray(arr: any[]): any[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SwipingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = route.params as { mode: 'movie' | 'food' | 'both' };

  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipedItems, setSwipedItems] = useState<any[]>([]);

  const pan = useRef(new Animated.ValueXY()).current;
  const swipeInProgress = useRef(false);

  const itemsRef = useRef(items);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Fetch items based on the mode
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let fetchedItems: any[] = [];

      if (mode === 'movie') {
        const response = await tmdbApi.getPopularMovies();
        const moviesData = response.results || response;
        fetchedItems = shuffleArray(moviesData);
      } else if (mode === 'food') {
        fetchedItems = getRandomFoods().slice(0, 5);
      } else if (mode === 'both') {
        let moviesItems: any[] = [];
        const response = await tmdbApi.getPopularMovies();
        const moviesData = response.results || response;
        if (moviesData.length > 0) {
          moviesItems = shuffleArray(moviesData).slice(0, 5);
        }
        const foodItems = getRandomFoods().slice(0, 5);
        fetchedItems = [...moviesItems, ...foodItems];
      }

      setItems(fetchedItems);
      setCurrentIndex(0);
      setLoading(false);
    };

    fetchItems();
  }, [mode]);

  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    swipeInProgress.current = false;
  }, [currentIndex]);

  // Create PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (swipeInProgress.current) return;

        let swipeAction = null;
        if (gestureState.dx > 120) {
          swipeAction = "wantToWatch";
        } else if (gestureState.dx < -120) {
          swipeAction = "dontWantToWatch";
        } else if (gestureState.dy < -120) {
          swipeAction = "Skip";
        }

        if (swipeAction) {
          swipeInProgress.current = true;
          Animated.timing(pan, {
            toValue: {
              x: swipeAction === "wantToWatch"
                ? SCREEN_WIDTH
                : swipeAction === "dontWantToWatch"
                ? -SCREEN_WIDTH
                : 0,
              y: swipeAction === "Skip" ? -SCREEN_WIDTH : 0
            },
            duration: 300,
            useNativeDriver: false
          }).start(() => {
            goToNextItem(swipeAction);
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

  // Advance to the next item and log the swiped item in Firestore using the modular API.
  const goToNextItem = async (swipeAction: string) => {
    const currentItem = itemsRef.current[currentIndexRef.current];
    if (currentItem) {
      console.log('Swiped Item:', {
        name: currentItem.title || currentItem.name,
        type: currentItem.poster_path ? 'movie' : 'food',
        action: swipeAction,
        index: currentIndexRef.current
      });
      console.log('Full Item Object:', currentItem);
      setSwipedItems(prev => [...prev, { item: currentItem, action: swipeAction }]);

      try {
        // Using the new modular API:
        const swipedItemsRef = collection(db, 'users', 'testUser', 'swipedItems');
        await addDoc(swipedItemsRef, {
          item: currentItem,
          action: swipeAction,
          timestamp: new Date().toISOString(),
        });
        console.log('Successfully added to Firestore!');
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }

    // Reset pan value and update current index
    pan.setValue({ x: 0, y: 0 });
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      if ((mode === 'movie' || mode === 'food') && newIndex >= 5) {
        navigation.navigate("ResultsScreen", { mode });
        return newIndex;
      }
      if (mode === 'both' && newIndex >= 10) {
        navigation.navigate("ResultsScreen", { mode });
        return newIndex;
      }
      if (newIndex >= itemsRef.current.length) {
        navigation.navigate("ResultsScreen", { mode });
        return prevIndex;
      }
      return newIndex;
    });
    swipeInProgress.current = false;
  };

  const currentItem = items[currentIndex];
  const imageSource = currentItem?.poster_path
    ? { uri: `https://image.tmdb.org/t/p/w500${currentItem.poster_path}` }
    : currentItem?.image;
  const titleText = currentItem?.title || currentItem?.name;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
        style={styles.overlay}
      />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Swipe to Choose</Text>
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
                source={
                  imageSource || {
                    uri: 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                }
                style={styles.moviePoster}
              />
              <Text style={styles.movieTitle}>{titleText}</Text>
            </Animated.View>
          ) : (
            <Text style={styles.placeholderText}>
              No more items available.
            </Text>
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
