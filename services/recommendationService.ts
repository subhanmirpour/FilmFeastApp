import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';

const getRecommendedItems = async (userId: string, type: 'movie' | 'food' | 'both') => {
  try {
    const db = getFirestore();
    const swipedItemsRef = collection(db, 'users', userId, 'swipedItems');
    
    // Build query based on type
    let q;
    if (type === 'movie') {
      q = query(
        swipedItemsRef,
        where('action', '==', 'wantToWatch'),
        where('item.poster_path', '!=', null)
      );
    } else if (type === 'food') {
      q = query(
        swipedItemsRef,
        where('action', '==', 'wantToEat'),
        where('item.image', '!=', null)
      );
    } else { // 'both' mode
      q = query(
        swipedItemsRef,
        where('action', 'in', ['wantToWatch', 'wantToEat'])
      );
    }

    const querySnapshot = await getDocs(q);
    const items: any[] = [];
    
    querySnapshot.forEach((doc) => {
      items.push(doc.data().item);
    });

    if (items.length === 0) return null;

    // Filter and return based on type
    if (type === 'both') {
      const movies = items.filter(item => item.poster_path);
      const foods = items.filter(item => item.image);
      return {
        movie: movies.length > 0 ? movies[Math.floor(Math.random() * movies.length)] : null,
        food: foods.length > 0 ? foods[Math.floor(Math.random() * foods.length)] : null
      };
    }
    
    return items[Math.floor(Math.random() * items.length)];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return null;
  }
};

export const getRecommendedItem = async (userId: string, mode: 'movie' | 'food' | 'both') => {
  const result = await getRecommendedItems(userId, mode);
  
  if (mode === 'both' && result) {
    // Prioritize showing at least one recommendation
    if (result.movie && result.food) {
      return Math.random() > 0.5 ? result.movie : result.food;
    }
    return result.movie || result.food || null;
  }
  
  return result;
};