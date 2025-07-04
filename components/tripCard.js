import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 0.4;

//--------------------------------------------------------------------------------------------------------------------------
//RENDER DELLA PAGINA
const TripCard = ({ trip, handleTripPress, onToggleFavorite }) => {
  
  const handleFavoritePress = (e) => {
    e.stopPropagation(); // Previene la propagazione del click alla card
    if (onToggleFavorite) {
      onToggleFavorite(trip.id);
    }
  };

  return (
    <Pressable style={styles.tripCard} onPress={handleTripPress}>
      {/* container interno sx */}
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: trip.image }}
          style={styles.tripImage}
          resizeMode="cover"
        />
        
        {/* Favorite button in top-right corner of image */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Icon 
            name={trip.favorite ? "heart" : "heart-outline"} 
            size={24} 
            color={trip.favorite ? "#FF6B6B" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      {/* container interno dx */}
      <View style={styles.rightContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{trip.title}</Text>
          {trip.favorite && (
            <Icon name="star" size={16} color="#FFD700" style={styles.starIcon} />
          )}
        </View>
        <View style={styles.datesContainer}>
          <Text style={styles.date}>From: {trip.departureDate}</Text>
          <Text style={styles.date}>To: {trip.returnDate}</Text>
        </View>
        <Text style={styles.category}>{trip.category}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tripCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
  leftContainer: {
    width: CARD_HEIGHT,
    height: CARD_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'left',
    alignItems: 'left',
    marginRight: 20,
    padding: 0,
    position: 'relative', // Per posizionare il pulsante favorite
  },
  tripImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 4,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'left',
    flex: 1,
  },
  starIcon: {
    marginLeft: 4,
  },
  datesContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#888',
    textAlign: 'left',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'left',
  },
});

export default TripCard;