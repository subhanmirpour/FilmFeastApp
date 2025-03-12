// @ts-nocheck
import React from 'react';
import { StyleSheet, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const backgroundImage = require('../assets/images/redchair.jpg');

const ResultsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = route.params as { mode: 'movie' | 'food' | 'both' };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
        style={styles.overlay}
      />
      <Layout style={styles.container}>
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
        <Text category="h5" style={styles.title}>Results</Text>
        <Layout style={styles.resultsContainer}>
          <Text category="h6" style={styles.placeholderText}>
            Your recommendations will appear here. (Mode: {mode})
          </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
});

export default ResultsScreen;
