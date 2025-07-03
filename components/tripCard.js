import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 0.4;

const TripCard = ({ trip, onPress }) => {
  return (
    <Pressable style={styles.tripCard} onPress={() => onPress && onPress(trip)}>
      {/* container interno sx */}
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: trip.image }}
          style={styles.tripImage}
          resizeMode="cover"
        />
      </View>

      {/* container interno dx */}
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{trip.title}</Text>
        <View style={styles.datesContainer}>
          <Text style={styles.date}>From: {trip.departureDate}</Text>
          <Text style={styles.date}>To: {trip.returnDate}</Text>
        </View>
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
  },
  tripImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'left',
    marginBottom: 8,
  },
  datesContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  date: {
    fontSize: 14,
    color: '#888',
    textAlign: 'left',
    marginBottom: 2,
  },
});

export default TripCard;