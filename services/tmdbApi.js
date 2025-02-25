import axios from 'axios';
import { TMDB_API_KEY } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = {
  getPopularMovies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: 1, // Fetch the first page of results
        },
      });
      console.log("Fetched Movies:", response.data.results); // ✅ Test API Response
      return response.data.results; // Returns an array of movies
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  },
};

export default tmdbApi;
