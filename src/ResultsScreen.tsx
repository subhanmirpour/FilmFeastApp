// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ImageBackground, TouchableOpacity, Image, View } from 'react-native';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { getRecommendedItem } from '../services/recommendationService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/redchair.jpg');

const ResultsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = route.params as { mode: 'movie' | 'food' | 'both' };

  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (mode === 'both') {
          const [movie, food] = await Promise.all([
            getRecommendedItem('testUser', 'movie'),
            getRecommendedItem('testUser', 'food')
          ]);
          setRecommendation({ movie, food });
        } else {
          const item = await getRecommendedItem('testUser', mode);
          setRecommendation(item);
        }
      } catch (error) {
        console.error('Error fetching recommendation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [mode]);

  const getLoadingText = () => {
    switch (mode) {
      case 'movie': return 'Thinking of the perfect movie...';
      case 'food': return 'Finding your ideal meal...';
      case 'both': return 'Crafting your recommendation...';
      default: return 'Loading...';
    }
  };

  const isMovie = recommendation?.poster_path || (mode === 'both' && recommendation?.movie?.poster_path);
  const isFood = recommendation?.image || (mode === 'both' && recommendation?.food?.image);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
        style={styles.overlay}
      />

      {loading && (
        <Layout style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>{getLoadingText()}</Text>
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
          {!loading && recommendation ? (
            mode === 'both' ? (
              <>
                <View style={styles.compositeContainer}>
                  <Text category="h4" style={styles.compositeText}>
                    You should watch "{recommendation.movie?.title || recommendation.movie?.name}" and this food would go perfectly with it "{recommendation.food?.name}"
                  </Text>
                </View>
                <View style={styles.bothContainer}>
                  {recommendation.movie && (
                    <View style={styles.itemContainer}>
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${recommendation.movie.poster_path}` }}
                        style={styles.recommendationImage}
                      />
                      <Text category="h6" style={styles.itemTitle}>
                        {recommendation.movie.title || recommendation.movie.name}
                      </Text>
                    </View>
                  )}
                  {recommendation.food && (
                    <View style={styles.itemContainer}>
                      <Image
                        source={recommendation.food.image}
                        style={styles.recommendationImage}
                      />
                      <Text category="h6" style={styles.itemTitle}>
                        {recommendation.food.name}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <>
                {isMovie && (
                  <>
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w500${recommendation.poster_path}` }}
                      style={styles.recommendationImage}
                    />
                    <Text category='h4' style={styles.recommendationTitle}>
                      {recommendation.title || recommendation.name}
                    </Text>
                  </>
                )}
                {isFood && (
                  <>
                    <Image
                      source={recommendation.image}
                      style={styles.recommendationImage}
                    />
                    <Text category='h4' style={styles.recommendationTitle}>
                      {recommendation.name}
                    </Text>
                    <Text category='s1' style={styles.foodDescription}>
                      {recommendation.description}
                    </Text>
                  </>
                )}
              </>
            )
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
    height: SCREEN_WIDTH * 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  recommendationImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  recommendationTitle: {
    marginTop: 20,
    color: '#ffcc00',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  foodDescription: {
    color: '#ffffff',
    textAlign: 'center',
    padding: 15,
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
  },
  compositeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: '95%',
    alignSelf: 'center',
  },
  compositeText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bothContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  itemTitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffcc00',
    textAlign: 'center',
  },
});

export default ResultsScreen;
