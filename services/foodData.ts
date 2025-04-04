export const foodList = [
  { name: 'Pizza', image: require("../assets/food/pizza.jpg") },
  { name: 'Burger', image: require('../assets/food/burger.jpg') },
  { name: 'Sushi', image: require('../assets/food/sushi.jpg') },
  { name: 'Pasta', image: require('../assets/food/pasta.jpg') },
  { name: 'Tacos', image: require('../assets/food/tacos.jpg') },
  { name: 'Salad', image: require('../assets/food/salad.jpg') },
  { name: 'Biryani', image: require('../assets/food/biryani.jpg') },
  { name: 'Burrito', image: require('../assets/food/burrito.jpg') },
  { name: 'Ramen', image: require('../assets/food/ramen.jpg') },
  { name: 'Mantu', image: require('../assets/food/mantu.jpg') },
  { name: 'Butter Chicken', image: require('../assets/food/butterchicken.jpg') },
  { name: 'Afghan Kebab', image: require('../assets/food/afghankebab.jpeg') },
  { name: 'Steak', image: require('../assets/food/steak.jpg') },
  { name: 'Fish', image: require('../assets/food/fish.jpg') },
  { name: 'Lasagna', image: require('../assets/food/lasagna.jpg') },
  { name: 'Dumplings', image: require('../assets/food/dumplings.jpg') },
  { name: 'Poutine', image: require('../assets/food/poutine.jpg') },
  { name: 'Tenders', image: require('../assets/food/tenders.jpg') },
  { name: 'Wings', image: require('../assets/food/wings.jpg') },
  { name: 'Buldak Ramen', image: require('../assets/food/buldakramen.jpg') },
  { name: 'Pho', image: require('../assets/food/pho.jpg') },
  { name: 'Bibimbap', image: require('../assets/food/bibimbap.jpg') },
  { name: 'Shakshuka', image: require('../assets/food/shakshuka.jpg') },
  { name: 'Arepa', image: require('../assets/food/arepa.jpg') },
  { name: 'Empanada', image: require('../assets/food/empanada.jpg') },
  { name: 'Jollof Rice', image: require('../assets/food/jollofrice.jpg') },
  { name: 'Tagine', image: require('../assets/food/tagine.jpg') },
  { name: 'Okonomiyaki', image: require('../assets/food/okonomiyaki.jpg') },
  { name: 'Gnocchi', image: require('../assets/food/gnocchi.jpg') },
  { name: 'Pierogi', image: require('../assets/food/pierogi.jpg') },
  { name: 'Loco Moco', image: require('../assets/food/locomoco.jpg') },
  { name: 'Ceviche', image: require('../assets/food/ceviche.jpg') },
  { name: 'Khachapuri', image: require('../assets/food/khachapuri.jpg') },
  { name: 'Tamales', image: require('../assets/food/tamales.jpg') },
  { name: 'Katsu Curry', image: require('../assets/food/katsucurry.jpg') },
  { name: 'Chilaquiles', image: require('../assets/food/chilaquiles.jpg') },
  { name: 'Cacio e Pepe', image: require('../assets/food/cacioePepe.jpg') },
  { name: 'Laksa', image: require('../assets/food/laksa.jpg') },
























];

// Function to shuffle and return the food list
export const getRandomFoods = () => {
  const shuffledFoods = [...foodList];

  for (let i = shuffledFoods.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledFoods[i], shuffledFoods[j]] = [shuffledFoods[j], shuffledFoods[i]];
  }

  return shuffledFoods;
};
