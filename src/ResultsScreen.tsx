// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Layout, Text, useTheme, Spinner } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { getRecommendedMovie } from '../services/recommendationService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/redchair.jpg');

const ResultsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = route.params as { mode: 'movie' | 'food' | 'both' };
  const [recommendedMovie, setRecommendedMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const [movie] = await Promise.all([
          getRecommendedMovie('testUser'),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        setRecommendedMovie(movie);
      } catch (error) {
        console.error('Error fetching recommendation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
        style={styles.overlay}
      />
      
      {loading && (
        <Layout style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Thinking of the perfect movie...</Text>
        </Layout>
      )}

      <Layout style={styles.container}>
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
        <Text category="h5" style={styles.title}>Results</Text>
        <Layout style={styles.resultsContainer}>
          {!loading && recommendedMovie ? (
            <>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${recommendedMovie.poster_path}` }}
                style={styles.moviePoster}
              />
              <Text category='h4' style={styles.movieTitle}>
                {recommendedMovie.title || recommendedMovie.name}
              </Text>
            </>
          ) : !loading && (
            <Text category='h6' style={styles.placeholderText}>
              No recommendations found. Keep swiping!
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
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 999,
  },
  loadingText: {
    fontSize: 24,
    color: '#ffcc00',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dashboardButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 10,
  },
  dashboardButtonText: {
    fontSize: 18,
    color: '#ffcc00',
    fontWeight: 'bold',
  },
  title: {
    marginBottom: 20,
    color: '#ffcc00',
  },
  resultsContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.8,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    backgroundColor: '#000000',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
  },
});

export default ResultsScreen;