import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mappa delle categorie con name come chiave
export const categories = {
  'Nature': {
    id: 1,
    name: 'Nature',
    icon: 'leaf',
    color: '#4CAF50' // verde
  },
  'Safari': {
    id: 2,
    name: 'Safari',
    icon: 'elephant',
    color: '#D2B48C' // sabbia
  },
  'Off Road': {
    id: 3,
    name: 'Off Road',
    icon: 'car',
    color: '#8B4513' // marrone
  },
  'City Life': {
    id: 4,
    name: 'City Life',
    icon: 'city',
    color: '#87CEEB' // celeste
  },
  'Beach': {
    id: 5,
    name: 'Beach',
    icon: 'beach',
    color: '#1E90FF' // blu intenso
  },
  'Mountain': {
    id: 6,
    name: 'Mountain',
    icon: 'hiking',
    color: '#708090' // grigio ardesia
  },
  'Culture': {
    id: 7,
    name: 'Culture',
    icon: 'book',
    color: '#9370DB' // viola medio
  },
  'Food & Wine': {
    id: 8,
    name: 'Food & Wine',
    icon: 'food-fork-drink',
    color: '#FF6347' // rosso pomodoro
  },
  'None': {
    id: 9,
    name: 'None',
    icon: 'close',
    color: 'gray'
  }
};

// Helper per ottenere un array di tutte le categorie (utile per iterazioni)
export const getCategoriesArray = () => Object.values(categories);

export default categories;