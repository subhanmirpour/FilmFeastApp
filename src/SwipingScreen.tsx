// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Text,
  Layout,
  Spinner,
  useTheme
} from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { initializeApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc } from '@react-native-firebase/firestore';
import tmdbApi from '../services/tmdbApi';
import { getRandomFoods } from '../services/foodData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/redchair.jpg');

const app = initializeApp();
const db = getFirestore(app);

function shuffleArray(arr: any[]): any[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Define an accessory function that returns the arrow icon
const BackArrow = (props) => (
  <Text {...props} style={{ color: '#ffcc00', fontSize: 28 }}>
    ←
  </Text>
);

const SwipingScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = route.params as { mode: 'movie' | 'food' | 'both' };

  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipedItems, setSwipedItems] = useState<any[]>([]);
  const [isBreak, setIsBreak] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const swipeInProgress = useRef(false);

  const itemsRef = useRef(items);
  const currentIndexRef = useRef(currentIndex);

  // Animated value for pulsing break text
  const breakScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Trigger pulsing animation when break is active
  useEffect(() => {
    if (isBreak) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breakScale, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(breakScale, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      breakScale.setValue(1);
    }
  }, [isBreak]);

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
        fetchedItems = getRandomFoods().slice(0, 10);
      } else if (mode === 'both') {
        let moviesItems: any[] = [];
        const response = await tmdbApi.getPopularMovies();
        const moviesData = response.results || response;
        if (moviesData.length > 0) {
          moviesItems = shuffleArray(moviesData).slice(0, 10);
        }
        const foodItems = getRandomFoods().slice(0, 10);
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
      onStartShouldSetPanResponder: () => !isBreak,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (swipeInProgress.current || isBreak) return;
        
        // Determine the swipe action based on the current item type (movie vs. food)
        const currentItem = itemsRef.current[currentIndexRef.current];
        let swipeAction = null;
        if (gestureState.dx > 120) {
          swipeAction = currentItem && currentItem.poster_path ? "wantToWatch" : "wantToEat";
        } else if (gestureState.dx < -120) {
          swipeAction = currentItem && currentItem.poster_path ? "dontWantToWatch" : "dontWantToEat";
        } else if (gestureState.dy < -120) {
          swipeAction = "skip";
        }

        if (swipeAction) {
          swipeInProgress.current = true;
          Animated.timing(pan, {
            toValue: {
              x: (swipeAction === "wantToWatch" || swipeAction === "wantToEat") 
                  ? SCREEN_WIDTH 
                  : (swipeAction === "dontWantToWatch" || swipeAction === "dontWantToEat") 
                    ? -SCREEN_WIDTH 
                    : 0,
              y: swipeAction === "skip" ? -SCREEN_WIDTH : 0
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

  // Advance to the next item and log the swiped item in Firestore.
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

    pan.setValue({ x: 0, y: 0 });
    
    // Compute new index and update state
    const newIndex = currentIndexRef.current + 1;

    // For 'both' mode, if movies are done (10 swipes), trigger a break overlay.
    if (mode === 'both' && newIndex === 10) {
      setIsBreak(true);
      setCurrentIndex(newIndex);
      // Pause for 2 seconds with break animation
      setTimeout(() => {
        setIsBreak(false);
      }, 2000);
    } else {
      setCurrentIndex(newIndex);
    }

    // If we have reached the limit, navigate outside of the state updater.
    if (
      ((mode === 'movie' || mode === 'food') && newIndex >= 10) ||
      (mode === 'both' && newIndex >= 20) ||
      (newIndex >= itemsRef.current.length)
    ) {
      setTimeout(() => {
        navigation.navigate("ResultsScreen", { mode });
      }, 0);
    }

    swipeInProgress.current = false;
  };

  const currentItem = items[currentIndex];
  const imageSource = currentItem?.poster_path
    ? { uri: `https://image.tmdb.org/t/p/w500${currentItem.poster_path}` }
    : currentItem?.image;
  const titleText = currentItem?.title || currentItem?.name;

  // Animated emoji effects for left/right swipes
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const dislikeOpacity = pan.x.interpolate({
    inputRange: [-120, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const likeScale = pan.x.interpolate({
    inputRange: [0, 120],
    outputRange: [0.5, 2],
    extrapolate: 'clamp',
  });
  const dislikeScale = pan.x.interpolate({
    inputRange: [-120, 0],
    outputRange: [2, 0.5],
    extrapolate: 'clamp',
  });

  // Animated emoji effects for vertical swipe (skip)
  const skipOpacity = pan.y.interpolate({
    inputRange: [-120, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const skipScale = pan.y.interpolate({
    inputRange: [-120, 0],
    outputRange: [2, 0.5],
    extrapolate: 'clamp',
  });

  // Choose emoji based on the item type (movie vs. food)
  const likeEmoji = currentItem && currentItem.poster_path ? "❤️" : "😋";
  const dislikeEmoji = currentItem && currentItem.poster_path ? "👎" : "☹️";
  const skipEmoji = "❌";

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
        style={styles.overlay}
      />
      <Layout style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#ffcc00', fontSize: 28 }}>←</Text>
        </TouchableOpacity>
        <Text category='h5' style={styles.title}>Swipe to Choose</Text>
        <Layout style={styles.swipeContainer}>
          {loading ? (
            <Spinner status='warning' size='giant' />
          ) : isBreak ? (
            <View style={styles.breakContainer}>
              <Animated.Text style={[styles.breakText, { transform: [{ scale: breakScale }] }]}>
                Now time to swipe food
              </Animated.Text>
            </View>
          ) : items.length > 0 && currentIndex < items.length ? (
            <Animated.View
              key={currentIndex}
              style={[styles.card, pan.getLayout()]}
              {...panResponder.panHandlers}
            >
              {/* Emoji overlays */}
              <Animated.Text style={[
                styles.emoji,
                {
                  left: 20,
                  top: 20,
                  opacity: likeOpacity,
                  transform: [{ scale: likeScale }, { rotate: '10deg' }],
                }
              ]}>
                {likeEmoji}
              </Animated.Text>
              <Animated.Text style={[
                styles.emoji,
                {
                  right: 20,
                  top: 20,
                  opacity: dislikeOpacity,
                  transform: [{ scale: dislikeScale }, { rotate: '-10deg' }],
                }
              ]}>
                {dislikeEmoji}
              </Animated.Text>
              <Animated.Text style={[
                styles.emoji,
                {
                  top: 20,
                  alignSelf: 'center',
                  opacity: skipOpacity,
                  transform: [{ scale: skipScale }],
                }
              ]}>
                {skipEmoji}
              </Animated.Text>
              <Image
                source={
                  imageSource || {
                    uri: 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                }
                style={styles.moviePoster}
              />
              <Text
                category='h6'
                style={[styles.movieTitle, { backgroundColor: theme['color-basic-900'] }]}
              >
                {titleText}
              </Text>
            </Animated.View>
          ) : (
            <Text category='h6' status='warning'>
              No more items available.
            </Text>
          )}
        </Layout>
      </Layout>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 10,
  },
  title: {
    marginBottom: 20,
    color: '#ffcc00',
  },
  swipeContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    height: 740,
    borderRadius: 1
  },
  movieTitle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    padding: 10,
  },
  emoji: {
    position: 'absolute',
    fontSize: 200,
    zIndex: 10,
  },
  breakContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  breakText: {
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 204, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default SwipingScreen;
