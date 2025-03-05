import axios from 'axios';
import { TMDB_BEARER_TOKEN } from '@env'; // Add your bearer token to your env file

const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = {
  getPopularMovies: async (numPages = 10) => {
    try {
      const requests = [];
      for (let page = 1; page <= numPages; page++) {
        const options = {
          method: 'GET',
          url: `${BASE_URL}/movie/popular`, // Change to '/movie/top_rated' if needed
          params: { language: 'en-US', page: page.toString() },
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        };
        requests.push(axios.request(options));
      }
      const responses = await Promise.all(requests);
      // Flatten the results into one array
      const movies = responses.flatMap(response => response.data.results);
      console.log("Fetched Movies:", movies);
      return movies;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  },
};

export default tmdbApi;
