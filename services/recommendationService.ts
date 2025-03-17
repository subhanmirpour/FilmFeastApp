import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';

export const getRecommendedMovie = async (userId: string) => {
  try {
    const db = getFirestore();
    const swipedItemsRef = collection(db, 'users', userId, 'swipedItems');
    const q = query(
      swipedItemsRef,
      where('action', '==', 'wantToWatch'),
      where('item.poster_path', '!=', null)
    );

    const querySnapshot = await getDocs(q);
    const movies: any[] = [];
    
    querySnapshot.forEach((doc) => {
      movies.push(doc.data().item);
    });

    if (movies.length === 0) return null;
    
    // Return a random movie from the wantToWatch list
    return movies[Math.floor(Math.random() * movies.length)];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return null;
  }
};