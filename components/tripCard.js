import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';

const TripCard = ({ trip, onPress }) => {
  return (
    <Pressable style={styles.tripCard} onPress={() => onPress && onPress(trip)}>
      {/*container interno sx*/}
      <View style={styles.leftContainer}>
        <Image source={{ uri: trip.image }} style={styles.tripImage} />
      </View>

      {/*container interno dx*/}
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

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 0.4;

const styles = StyleSheet.create({
  tripCard: {
    width: CARD_WIDTH,
    minHeight: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 12,
    marginTop: 5,
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  tripImage: {
    width: CARD_HEIGHT * 0.5,
    height: CARD_HEIGHT * 0.5,
    borderRadius: (CARD_HEIGHT * 0.5) / 2,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: '#ddd',
    padding: 30,
    marginLeft: 15,
  },
  rightContainer: {
    flex: 1,
    padding: 30,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'left',
    marginTop: 4,
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