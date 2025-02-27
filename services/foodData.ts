export const foodList = [
    { name: 'Pizza', image: require("../assets/food/pizza.jpg") },
    { name: 'Burgers', image: require('../assets/food/burger.jpeg') },
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
  